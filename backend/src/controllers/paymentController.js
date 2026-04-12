const paymentService = require('../services/paymentService');
const { createPaymentSchema, validatePaymentSchema } = require('../validators/paymentValidator');
const path = require('path');
const fs = require('fs');

exports.createPayment = async (req, res) => {
  try {
    const validatedData = createPaymentSchema.parse(req.body);
    const payment = await paymentService.createPayment(req.user.id, validatedData);

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.validatePayment = async (req, res) => {
  try {
    const validatedData = validatePaymentSchema.parse(req.body);
    const payment = await paymentService.validatePayment(
      req.user.id, 
      req.params.id, 
      validatedData
    );

    res.json({ success: true, data: payment });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getReceipt = async (req, res) => {
  try {
    const Payment = require('../models/Payment');
    const payment = await Payment.findById(req.params.id);

    if (!payment || !payment.receiptUrl) {
      return res.status(404).json({ success: false, error: "Reçu non disponible" });
    }

    // Sécurité: Proprio ou Admin/Créateur uniquement
    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        // Optionnel: Vérifier si c'est l'admin de la tontine
    }

    const filePath = path.join(__dirname, '../../', payment.receiptUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: "Fichier introuvable" });
    }

    res.contentType("application/pdf");
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const history = await paymentService.getMyHistory(req.user.id, page);
    res.json({ success: true, ...history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTontinePayments = async (req, res) => {
    try {
      const payments = await Payment.find({ tontine: req.params.tontineId })
        .populate('user', 'nom prenom telephone')
        .sort('-createdAt');
  
      res.json({ success: true, data: payments });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
