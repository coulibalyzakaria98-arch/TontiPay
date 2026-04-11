const User = require('../models/User');
const Tontine = require('../models/Tontine');
const Payment = require('../models/Payment');
const Membre = require('../models/Membre');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update user status (block/unblock)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Statut invalide' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Rôle invalide' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all tontines
// @route   GET /api/admin/tontines
// @access  Private/Admin
exports.getAllTontines = async (req, res) => {
  try {
    const tontines = await Tontine.find()
      .populate('createur', 'nom prenom email')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: tontines.length,
      data: tontines,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete tontine
// @route   DELETE /api/admin/tontines/:id
// @access  Private/Admin
exports.deleteTontine = async (req, res) => {
  try {
    const tontine = await Tontine.findById(req.params.id);

    if (!tontine) {
      return res.status(404).json({ success: false, error: 'Tontine non trouvée' });
    }

    // Delete related members and payments
    await Membre.deleteMany({ tontineId: tontine._id });
    await Payment.deleteMany({ tontine: tontine._id });
    await tontine.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const tontineCount = await Tontine.countDocuments();
    const activeTontines = await Tontine.countDocuments({ statut: 'en cours' });
    
    const payments = await Payment.find({ statut: 'validated' });
    const totalVolume = payments.reduce((acc, curr) => acc + curr.montant, 0);

    res.status(200).json({
      success: true,
      data: {
        userCount,
        tontineCount,
        activeTontines,
        totalVolume
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
