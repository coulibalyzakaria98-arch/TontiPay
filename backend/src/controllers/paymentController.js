const paymentService = require('../services/paymentService');
const { createPaymentSchema, validatePaymentSchema } = require('../validators/paymentValidator');
const path = require('path');
const fs = require('fs');

/**
 * Soumettre un nouveau paiement
 */
exports.createPayment = async (req, res) => {
  try {
    const validatedData = createPaymentSchema.parse(req.body);
    const payment = await paymentService.createPayment(req.user.id, validatedData);

    res.status(201).json({
      success: true,
      message: "Paiement soumis avec succès. En attente de validation.",
      data: payment
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Valider ou rejeter (Admin)
 */
exports.validatePayment = async (req, res) => {
  try {
    const validatedData = validatePaymentSchema.parse(req.body);
    const payment = await paymentService.validatePayment(
      req.user.id,
      req.params.id,
      validatedData
    );

    res.json({
      success: true,
      message: `Paiement ${payment.status === 'approved' ? 'validé' : 'rejeté'} avec succès.`,
      data: payment
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Télécharger le reçu
 */
exports.getReceipt = async (req, res) => {
  try {
    const payment = await paymentService.getReceipt(req.user.id, req.params.id, req.user.role);

    const filePath = path.join(__dirname, '../../', payment.receiptUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: "Fichier physique introuvable." });
    }

    res.contentType("application/pdf");
    res.sendFile(filePath);
  } catch (error) {
    if (error.message === 'Reçu introuvable.') {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message === 'Accès refusé.') {
      return res.status(403).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Récupérer tous les paiements (Admin)
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Historique personnel
 */
exports.getMyHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await paymentService.getHistory(req.user.id, page);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTontinePayments = async (req, res) => {
  try {
    const payments = await paymentService.getTontinePayments(req.user.id, req.params.tontineId, req.user.role);
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
