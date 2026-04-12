const Payment = require('../models/Payment');
const Tontine = require('../models/Tontine');
const Notification = require('../models/Notification');
const tontineService = require('./tontineService');
const { generateReceiptPDF } = require('../utils/receipts/pdfGenerator');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
  /**
   * Crée un nouveau paiement en attente
   */
  async createPayment(userId, paymentData) {
    const tontine = await Tontine.findById(paymentData.tontineId);
    if (!tontine) throw new Error('Tontine non trouvée');

    // Vérifier si un paiement avec la même référence existe déjà
    const existingRef = await Payment.findOne({ reference: paymentData.reference });
    if (existingRef) throw new Error('Cette référence de transaction a déjà été soumise');

    const payment = await Payment.create({
      user: userId,
      tontine: paymentData.tontineId,
      montant: paymentData.montant,
      reference: paymentData.reference,
      moyenPaiement: paymentData.moyenPaiement,
      tour: tontine.tourActuel,
      preuve: paymentData.preuve || null,
      statut: 'pending',
    });

    // Notification pour l'administrateur (le créateur de la tontine)
    await Notification.create({
      user: tontine.createur,
      message: `🔔 Nouveau paiement de ${payment.montant.toLocaleString()} FCFA à valider pour "${tontine.nom}".`,
      type: 'info'
    });

    return payment;
  }

  /**
   * Valide ou rejette un paiement
   */
  async validatePayment(adminId, paymentId, validationData) {
    const payment = await Payment.findById(paymentId)
      .populate('tontine')
      .populate('user', 'nom prenom telephone');

    if (!payment) throw new Error('Paiement non trouvé');

    // Vérification : L'admin est-il le créateur de la tontine ?
    if (payment.tontine.createur.toString() !== adminId) {
      throw new Error('Non autorisé : Seul l\'administrateur de cette tontine peut valider ce paiement');
    }

    if (payment.statut !== 'pending') {
      throw new Error(`Ce paiement est déjà ${payment.statut}`);
    }

    const { statut, reason } = validationData;
    
    payment.statut = statut;
    payment.dateValidation = new Date();
    
    if (statut === 'rejected') {
      payment.reason = reason || 'Référence invalide ou preuve insuffisante.';
    } else {
      // Générer l'ID de reçu unique : PAY-ANNÉE-4derniersUUID
      const year = new Date().getFullYear();
      const shortId = uuidv4().substring(0, 4).toUpperCase();
      payment.receiptId = `PAY-${year}-${shortId}`;
      
      // Générer le PDF
      payment.receiptUrl = await generateReceiptPDF(payment);
      
      // Vérifier si la tontine doit avancer au tour suivant
      await tontineService.checkAndAdvanceRound(payment.tontine._id);
    }

    await payment.save();

    // Notification pour l'utilisateur
    const statusEmoji = statut === 'approved' ? '✅' : '❌';
    const statusText = statut === 'approved' ? 'validé' : 'rejeté';
    
    await Notification.create({
      user: payment.user._id,
      message: `${statusEmoji} Votre paiement pour "${payment.tontine.nom}" a été ${statusText}.${statut === 'rejected' ? ` Motif : ${reason}` : ''}`,
      type: statut === 'approved' ? 'payment_validated' : 'payment_rejected'
    });

    return payment;
  }

  /**
   * Récupère l'historique des paiements d'un utilisateur
   */
  async getMyPayments(userId) {
    return await Payment.find({ user: userId })
      .populate('tontine', 'nom montant')
      .sort('-createdAt');
  }

  /**
   * Récupère tous les paiements d'une tontine (pour l'admin)
   */
  async getTontinePayments(tontineId) {
    return await Payment.find({ tontine: tontineId })
      .populate('user', 'nom prenom telephone')
      .sort('-createdAt');
  }
}

module.exports = new PaymentService();
