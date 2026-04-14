const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const Tontine = require('../models/Tontine');
const tontineService = require('./tontineService');
const { generateReceipt } = require('../utils/pdfGenerator');

class PaymentService {
  /**
   * Soumission d'un nouveau paiement par l'utilisateur
   */
  async createPayment(userId, data) {
    const tontine = await Tontine.findById(data.tontineId);
    if (!tontine) throw new Error("Tontine non trouvée");

    // Vérifier si la référence est unique
    const existing = await Payment.findOne({ reference: data.reference });
    if (existing) throw new Error("Cette référence de transaction a déjà été soumise");

    const payment = await Payment.create({
      user: userId,
      tontine: data.tontineId,
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      transactionId: data.transactionId,
      screenshotUrl: data.screenshotUrl,
      tour: tontine.tourActuel,
      status: 'pending'
    });

    // Notifier l'administrateur
    await Notification.create({
      user: tontine.createur,
      message: `🔔 Nouveau paiement de ${payment.amount.toLocaleString()} FCFA à valider pour "${tontine.nom}".`,
      type: 'info'
    });

    // Log l'action
    await AuditLog.create({
      action: 'PAYMENT_SUBMITTED',
      performedBy: userId,
      resourceId: payment._id,
      details: `Paiement soumis pour tontine ${tontine.nom}`
    });

    return payment;
  }

  /**
   * Validation ou Rejet par l'administrateur
   */
  async validatePayment(adminId, paymentId, validationData) {
    const { status, reason } = validationData;

    const payment = await Payment.findById(paymentId)
      .populate('user', 'nom prenom email telephone')
      .populate('tontine', 'nom createur');

    if (!payment) throw new Error("Paiement introuvable");

    // Sécurité: Seul le créateur de la tontine peut valider
    if (payment.tontine.createur.toString() !== adminId) {
      throw new Error("Non autorisé : Vous n'êtes pas l'administrateur de cette tontine");
    }

    if (payment.status !== 'pending') {
      throw new Error(`Ce paiement a déjà été traité (Statut actuel: ${payment.status})`);
    }

    payment.status = status;
    payment.validatedAt = new Date();
    payment.validatedBy = adminId;

    if (status === 'approved') {
      // 1. Générer l'ID unique de reçu : PAY-YEAR-SEQUENTIAL
      const year = new Date().getFullYear();
      const count = await Payment.countDocuments({ status: 'approved', receiptId: { $regex: `^PAY-${year}` } });
      const sequentialNum = (count + 1).toString().padStart(4, '0');
      payment.receiptId = `PAY-${year}-${sequentialNum}`;

      // 2. Générer le PDF
      payment.receiptUrl = await generateReceipt(payment);

      // 3. Avancer le tour si nécessaire via le service tontine
      await tontineService.checkAndAdvanceRound(payment.tontine._id);
    } else {
      payment.rejectionReason = reason;
    }

    await payment.save();

    // 4. Audit Trail
    await AuditLog.create({
      action: status === 'approved' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
      performedBy: adminId,
      resourceId: payment._id,
      details: status === 'rejected' ? `Raison : ${reason}` : `Reçu ID : ${payment.receiptId}`
    });

    // 5. Notification Utilisateur
    await Notification.create({
      user: payment.user._id,
      message: status === 'approved' 
        ? `✅ Votre paiement pour "${payment.tontine.nom}" a été validé. Votre reçu est disponible.`
        : `❌ Votre paiement pour "${payment.tontine.nom}" a été rejeté. Motif : ${reason}`,
      type: status === 'approved' ? 'payment_validated' : 'payment_rejected'
    });

    return payment;
  }

  /**
   * Récupérer tous les paiements (Admin global)
   */
  async getAllPayments() {
    return Payment.find()
      .populate('user', 'nom prenom email telephone')
      .populate('tontine', 'nom')
      .sort('-createdAt');
  }

  /**
   * Historique paginé
   */
  async getHistory(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const payments = await Payment.find({ user: userId })
      .populate('tontine', 'nom')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    
    const total = await Payment.countDocuments({ user: userId });
    return { payments, total, pages: Math.ceil(total / limit) };
  }

  async getTontinePayments(userId, tontineId, role) {
    const tontine = await Tontine.findById(tontineId);
    if (!tontine) throw new Error('Tontine introuvable');

    if (role === 'admin' || tontine.createur.toString() === userId) {
      return Payment.find({ tontine: tontineId })
        .populate('user', 'nom prenom telephone')
        .sort('-createdAt');
    }

    return Payment.find({ tontine: tontineId, user: userId })
      .populate('user', 'nom prenom telephone')
      .sort('-createdAt');
  }
}

module.exports = new PaymentService();
