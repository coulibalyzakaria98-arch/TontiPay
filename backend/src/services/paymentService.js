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
      status: 'en_attente'
    });

    // Notifier l'administrateur
    await Notification.create({
      user: tontine.createur,
      message: `🔔 Nouveau paiement de ${payment.amount.toLocaleString()} FCFA à valider pour "${tontine.nom}".`,
      type: 'info'
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

    if (payment.status !== 'en_attente') {
      throw new Error(`Ce paiement a déjà été traité (Statut actuel: ${payment.status})`);
    }

    payment.status = status;
    payment.validatedAt = new Date();
    payment.validatedBy = adminId;

    if (status === 'valide') {
      // 1. Générer l'ID unique de reçu : PAY-2026-XXXX
      const year = new Date().getFullYear();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      payment.receiptId = `PAY-${year}-${random}`;

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
      action: status === 'valide' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
      performedBy: adminId,
      resourceId: payment._id,
      details: status === 'rejete' ? `Raison : ${reason}` : `Reçu ID : ${payment.receiptId}`
    });

    // 5. Notification Utilisateur
    await Notification.create({
      user: payment.user._id,
      message: status === 'valide' 
        ? `✅ Votre paiement pour "${payment.tontine.nom}" a été validé. Votre reçu est disponible.`
        : `❌ Votre paiement pour "${payment.tontine.nom}" a été rejeté. Motif : ${reason}`,
      type: status === 'valide' ? 'payment_validated' : 'payment_rejected'
    });

    return payment;
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

    // Si l'utilisateur est l'admin de la tontine, on retourne tous les paiements.
    if (role === 'admin' || tontine.createur.toString() === userId) {
      return Payment.find({ tontine: tontineId })
        .populate('user', 'nom prenom telephone')
        .sort('-createdAt');
    }

    // Les membres ne voient que leurs propres paiements dans cette tontine.
    return Payment.find({ tontine: tontineId, user: userId })
      .populate('user', 'nom prenom telephone')
      .sort('-createdAt');
  }
}

module.exports = new PaymentService();
