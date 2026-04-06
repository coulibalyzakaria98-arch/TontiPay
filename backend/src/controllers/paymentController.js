const Payment = require('../models/Payment');

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    const { tontineId, montant, reference, preuve } = req.body;

    const payment = await Payment.create({
      user: req.user.id,
      tontine: tontineId,
      montant,
      reference,
      preuve: preuve || null, // For now text, later from file upload
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      const Payment = require('../models/Payment');
      const Notification = require('../models/Notification');

      // @desc    Create a new payment
      // @route   POST /api/payments
      ...
      // @desc    Validate a payment (Admin)
      // @route   PUT /api/payments/:id/validate
      // @access  Private/Admin
      exports.validatePayment = async (req, res) => {
        try {
          const payment = await Payment.findById(req.params.id).populate('tontine', 'nom');

          if (!payment) {
            return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
          }

          payment.statut = 'validated';
          payment.dateValidation = new Date();

          await payment.save();

          // Create Notification
          await Notification.create({
            user: payment.user,
            message: `Votre paiement de ${payment.montant} FCFA pour la tontine "${payment.tontine.nom}" a été validé.`,
            type: 'payment_validated'
          });

          res.json({ success: true, data: payment });
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
        }
      };

      // @desc    Reject a payment (Admin)
      // @route   PUT /api/payments/:id/reject
      // @access  Private/Admin
      exports.rejectPayment = async (req, res) => {
        try {
          const payment = await Payment.findById(req.params.id).populate('tontine', 'nom');

          if (!payment) {
            return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
          }

          payment.statut = 'rejected';
          payment.dateValidation = new Date();

          await payment.save();

          // Create Notification
          await Notification.create({
            user: payment.user,
            message: `Votre paiement de ${payment.montant} FCFA pour la tontine "${payment.tontine.nom}" a été refusé.`,
            type: 'payment_rejected'
          });

          res.json({ success: true, data: payment });
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
        }
      };

      // @desc    Get payments for a specific tontine
      // @route   GET /api/payments/tontine/:tontineId
      // @access  Private
      exports.getTontinePayments = async (req, res) => {
        try {
          const payments = await Payment.find({ tontine: req.params.tontineId })
            .populate('user', 'nom prenom')
            .sort('-datePaiement');

          res.json({ success: true, data: payments });
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
        }
      };

      // @desc    Get current user's payments
      ...
// @route   GET /api/payments/my-payments
// @access  Private
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('tontine', 'nom montant')
      .sort('-datePaiement');

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate('user', 'nom prenom email telephone')
      .populate('tontine', 'nom')
      .sort('-datePaiement');

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
