const paymentService = require('../services/paymentService');
const { paymentSchema, validationSchema } = require('../validations/paymentValidation');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Soumettre un nouveau paiement
 * @route   POST /api/payments
 */
exports.createPayment = async (req, res) => {
  try {
    // 1. Validation Zod
    const validatedData = paymentSchema.parse(req.body);

    // 2. Appel du Service
    const payment = await paymentService.createPayment(req.user.id, validatedData);

    res.status(201).json({
      success: true,
      message: "Paiement soumis avec succès. En attente de validation admin.",
      data: payment,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Valider ou Rejeter un paiement (Admin Only)
 * @route   PATCH /api/payments/:id/validate
 */
exports.validatePayment = async (req, res) => {
  try {
    // 1. Validation Zod
    const validatedData = validationSchema.parse(req.body);

    // 2. Appel du Service
    const payment = await paymentService.validatePayment(
      req.user.id, 
      req.params.id, 
      validatedData
    );

    res.json({
      success: true,
      message: `Paiement ${payment.statut === 'approved' ? 'approuvé' : 'rejeté'} avec succès.`,
      data: payment,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Télécharger le reçu PDF
 * @route   GET /api/payments/:id/receipt
 */
exports.getReceipt = async (req, res) => {
  try {
    const Payment = require('../models/Payment');
    const payment = await Payment.findById(req.params.id);

    if (!payment || !payment.receiptUrl) {
      return res.status(404).json({ success: false, error: "Reçu non disponible ou paiement non validé." });
    }

    // Sécurité : Seul le propriétaire ou l'admin peut voir le reçu
    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      // Note: On peut aussi vérifier si c'est le créateur de la tontine
      return res.status(403).json({ success: false, error: "Non autorisé à voir ce reçu." });
    }

    const filePath = path.join(__dirname, '../../', payment.receiptUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: "Fichier du reçu introuvable sur le serveur." });
    }

    res.contentType("application/pdf");
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Mes paiements
 * @route   GET /api/payments/my-payments
 */
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await paymentService.getMyPayments(req.user.id);
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Paiements d'une tontine (Admin)
 * @route   GET /api/payments/tontine/:tontineId
 */
exports.getTontinePayments = async (req, res) => {
  try {
    const payments = await paymentService.getTontinePayments(req.params.tontineId);
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
