const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const Tontine = require('../models/Tontine');
const { checkAndAdvanceRound } = require('./tontineController');

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    const { tontineId, montant, reference, preuve, moyenPaiement } = req.body;

    const tontine = await Tontine.findById(tontineId);
    if (!tontine) {
      return res.status(404).json({ success: false, error: 'Tontine non trouvée' });
    }

    const payment = await Payment.create({
      user: req.user.id,
      tontine: tontineId,
      montant,
      reference,
      moyenPaiement,
      tour: tontine.tourActuel,
      preuve: preuve || null,
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Validate a payment (Only Tontine Creator)
// @route   PUT /api/payments/:id/validate
// @access  Private
exports.validatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('tontine');

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
    }

    // AUTH CHECK: Is the requester the creator of the tontine?
    if (payment.tontine.createur.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Seul l\'administrateur (créateur) de cette tontine peut valider les paiements' 
      });
    }

    payment.statut = 'validated';
    payment.dateValidation = new Date();
    await payment.save();

    // Check if tontine should move to next round
    await checkAndAdvanceRound(payment.tontine._id);

    // Create Notification for the payer
    await Notification.create({
      user: payment.user,
      message: `✅ Votre paiement de ${payment.montant.toLocaleString()} FCFA pour "${payment.tontine.nom}" a été validé par l'administrateur.`,
      type: 'payment_validated'
    });

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Reject a payment (Only Tontine Creator)
// @route   PUT /api/payments/:id/reject
// @access  Private
exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('tontine');

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Paiement non trouvé' });
    }

    // AUTH CHECK: Is the requester the creator of the tontine?
    if (payment.tontine.createur.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Seul l\'administrateur (créateur) de cette tontine peut rejeter les paiements' 
      });
    }

    payment.statut = 'rejected';
    payment.dateValidation = new Date();
    await payment.save();

    // Create Notification for the payer
    await Notification.create({
      user: payment.user,
      message: `❌ Votre paiement pour "${payment.tontine.nom}" a été rejeté. Veuillez vérifier les détails de la transaction.`,
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
      .populate('user', 'nom prenom telephone')
      .sort('-datePaiement');

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current user's payments
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

// @desc    Get all payments (Super Admin only)
// @route   GET /api/payments
// @access  Private/SuperAdmin
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
