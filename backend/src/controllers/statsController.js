const User = require('../models/User');
const Tontine = require('../models/Tontine');
const Payment = require('../models/Payment');

// @desc    Get system statistics (Admin only)
// @route   GET /api/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTontines = await Tontine.countDocuments();

    // Aggregate total validated amount
    const validatedPayments = await Payment.find({ statut: 'validated' });
    const totalMontant = validatedPayments.reduce((acc, p) => acc + p.montant, 0);

    const pendingPayments = await Payment.countDocuments({
      statut: 'pending',
    });

    const activeTontines = await Tontine.countDocuments({
        statut: 'en cours'
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTontines,
        totalMontant,
        pendingPayments,
        activeTontines
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
