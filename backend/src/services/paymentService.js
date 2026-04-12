const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const Tontine = require('../models/Tontine');
const tontineService = require('./tontineService');
const { generateReceipt } = require('../utils/pdfGenerator');

class PaymentService {
  /**
   * Crée une demande de paiement
   */
  async createPayment(userId, data) {
    const tontine = await Tontine.findById(data.tontineId);
    if (!tontine) throw new Error("Tontine non trouvée");

    // Vérifier si la référence est déjà utilisée
    const existingRef = await Payment.findOne({ reference: data.reference });
    if (existingRef) throw new Error("Cette référence de transaction a déjà été soumise");

    const payment = await Payment.create({
      user: userId,
      tontine: data.tontineId,
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      tour: tontine.tourActuel,
      status: 'pending'
    });

    // Notifier le créateur de la tontine (Admin)
    await Notification.create({
      user: tontine.createur,
      message: `🔔 Nouveau paiement de ${payment.amount.toLocaleString()} FCFA à valider pour "${tontine.nom}".`,
      type: 'info'
    });

    return payment;
  }

  /**
   * Valide ou rejette un paiement (Admin Only)
   */
  async validatePayment(adminId, paymentId, validationData) {
    const { status, reason } = validationData;

    const payment = await Payment.findById(paymentId)
      .populate('user', 'nom prenom email telephone')
      .populate('tontine', 'nom createur montant');

    if (!payment) throw new Error("Paiement introuvable");

    // Sécurité: Seul le créateur peut valider
    if (payment.tontine.createur.toString() !== adminId) {
      throw new Error("Non autorisé : Seul l'administrateur de cette tontine peut effectuer cette action");
    }

    if (payment.status !== 'pending') {
      throw new Error(`Ce paiement a déjà été traité (Statut: ${payment.status})`);
    }

    payment.status = status;
    payment.validatedAt = new Date();
    payment.validatedBy = adminId;

    if (status === 'approved') {
      // 1. Générer un ID de reçu unique: PAY-2026-XXXX
      const year = new Date().getFullYear();
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      payment.receiptId = `PAY-${year}-${randomPart}`;

      // 2. Générer le PDF
      payment.receiptUrl = await generateReceipt(payment);

      // 3. Avancer le tour si nécessaire
      await tontineService.checkAndAdvanceRound(payment.tontine._id);
    } else {
      payment.rejectionReason = reason;
    }

    await payment.save();

    // 4. Audit Log
    await AuditLog.create({
      action: status === 'approved' ? 'PAYMENT_APPROVED' : 'PAYMENT_REJECTED',
      performedBy: adminId,
      resourceId: payment._id,
      details: { reason, receiptId: payment.receiptId }
    });

    // 5. Notification Utilisateur
    await Notification.create({
      user: payment.user._id,
      message: status === 'approved' 
        ? `✅ Votre paiement de ${payment.amount.toLocaleString()} FCFA pour "${payment.tontine.nom}" a été validé ! Reçu disponible.`
        : `❌ Votre paiement pour "${payment.tontine.nom}" a été rejeté. Motif : ${reason}`,
      type: status === 'approved' ? 'payment_validated' : 'payment_rejected'
    });

    return payment;
  }

  /**
   * Récupère l'historique paginé d'un utilisateur
   */
  async getMyHistory(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const payments = await Payment.find({ user: userId })
      .populate('tontine', 'nom')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    
    const total = await Payment.countDocuments({ user: userId });

    return { payments, total, pages: Math.ceil(total / limit) };
  }
}

module.exports = new PaymentService();
