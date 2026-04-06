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

    // Données pour le graphique (6 derniers mois)
    const chartData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('fr-FR', { month: 'short' });
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthlyPayments = await Payment.find({
        statut: 'validated',
        dateValidation: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const total = monthlyPayments.reduce((acc, p) => acc + p.montant, 0);
      chartData.push({ name: monthName, montant: total });
    }

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTontines,
        totalMontant,
        pendingPayments,
        activeTontines,
        chartData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
