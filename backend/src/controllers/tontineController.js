const Tontine = require('../models/Tontine');
const Membre = require('../models/Membre');
const tontineService = require('../services/tontineService');

// @desc    Create new tontine
// @route   POST /api/tontines
// @access  Private
exports.createTontine = async (req, res) => {
  try {
    req.body.createur = req.user.id;

    const tontine = await Tontine.create(req.body);

    // Add creator as first member
    await Membre.create({
      userId: req.user.id,
      tontineId: tontine._id,
      position: 1,
    });

    res.status(201).json({
      success: true,
      data: tontine,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Join tontine via code
// @route   POST /api/tontines/join
// @access  Private
exports.joinTontine = async (req, res) => {
  try {
    const { code } = req.body;

    const tontine = await Tontine.findOne({ code });

    if (!tontine) {
      return res.status(404).json({
        success: false,
        error: 'Tontine non trouvée avec ce code',
      });
    }

    // Check if tontine is full
    const currentMembersCount = await Membre.countDocuments({ tontineId: tontine._id });

    if (currentMembersCount >= tontine.nombreMembres) {
      return res.status(400).json({
        success: false,
        error: 'Cette tontine est déjà complète',
      });
    }

    // Check if user is already a member
    const existingMember = await Membre.findOne({
      userId: req.user.id,
      tontineId: tontine._id,
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: 'Vous êtes déjà membre de cette tontine',
      });
    }

    // Join tontine
    const membre = await Membre.create({
      userId: req.user.id,
      tontineId: tontine._id,
      position: currentMembersCount + 1,
    });

    // Check if tontine is now full to trigger the random draw via Service
    const updatedCount = await Membre.countDocuments({ tontineId: tontine._id });
    
    if (updatedCount === tontine.nombreMembres) {
      await tontineService.assignPositions(tontine._id, tontine.nombreMembres);
    }

    res.status(200).json({
      success: true,
      data: membre,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get all tontines for current user
// @route   GET /api/tontines/my-tontines
// @access  Private
exports.getMyTontines = async (req, res) => {
  try {
    const membres = await Membre.find({ userId: req.user.id }).populate('tontineId');

    const tontines = membres
        .filter(m => m.tontineId !== null)
        .map((m) => m.tontineId);

    res.status(200).json({
      success: true,
      count: tontines.length,
      data: tontines,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get single tontine with members
// @route   GET /api/tontines/:id
// @access  Private
exports.getTontine = async (req, res) => {
  try {
    const tontine = await Tontine.findById(req.params.id).populate('createur', 'nom prenom');

    if (!tontine) {
      return res.status(404).json({
        success: false,
        error: 'Tontine non trouvée',
      });
    }

    const members = await Membre.find({ tontineId: tontine._id })
      .populate('userId', 'nom prenom telephone')
      .sort('position');

    res.status(200).json({
      success: true,
      data: {
        tontine,
        members,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};
