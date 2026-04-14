const Tontine = require('../models/Tontine');
const Membre = require('../models/Membre');
const tontineService = require('../services/tontineService');

// @desc    Create new tontine
// @route   POST /api/tontines
// @access  Private
exports.createTontine = async (req, res) => {
  try {
    console.log('DEBUG: Creating tontine with payload:', req.body);
    const typeTirage = req.body.typeTirage;
    const normalizedTypeTirage =
      typeTirage === 'hasard' || typeTirage === 'hasard_pur'
        ? 'aleatoire'
        : typeTirage;

    const payload = {
      ...req.body,
      createur: req.user.id,
      typeTirage: normalizedTypeTirage,
    };

    const tontine = await Tontine.create(payload);

    // Le créateur est TOUJOURS le premier arrivant (ordreArrivee = 1)
    await Membre.create({
      userId: req.user.id,
      tontineId: tontine._id,
      position: 1, // Sera recalculé lors du tirage au sort si besoin
      ordreArrivee: 1,
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

    if (tontine.statut !== 'en attente') {
      return res.status(400).json({
        success: false,
        error: 'Cette tontine a déjà commencé ou est terminée',
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

    // Nombre actuel de membres pour déterminer l'ordre d'arrivée
    const currentMembersCount = await Membre.countDocuments({ tontineId: tontine._id });

    if (currentMembersCount >= tontine.nombreMembres) {
      return res.status(400).json({
        success: false,
        error: 'Cette tontine est déjà complète',
      });
    }

    // Rejoindre la tontine (ordreArrivee = count + 1)
    const membre = await Membre.create({
      userId: req.user.id,
      tontineId: tontine._id,
      position: currentMembersCount + 1, // Provisoire
      ordreArrivee: currentMembersCount + 1,
    });

    // Si la tontine est complète, déclencher le tirage au sort aléatoire via le service
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
      .filter((m) => m.tontineId !== null)
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
