const Tontine = require('../models/Tontine');
const Membre = require('../models/Membre');
const Notification = require('../models/Notification');

// Helper function to shuffle and assign positions (Tirage au sort)
exports.assignPositions = async (tontineId, nombreMembres) => {
  const members = await Membre.find({ tontineId });
  
  // 1. Prepare positions array [1, 2, ..., n]
  const positions = Array.from({ length: nombreMembres }, (_, i) => i + 1);
  
  // 2. Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // 3. Assign and save
  const savePromises = members.map((member, index) => {
    member.position = positions[index];
    return member.save();
  });

  await Promise.all(savePromises);

  // 4. Update Tontine status
  await Tontine.findByIdAndUpdate(tontineId, { statut: 'en cours', tourActuel: 1 });

  // 5. Notify all members
  const tontine = await Tontine.findById(tontineId);
  const notificationPromises = members.map(member => {
    return Notification.create({
      user: member.userId,
      message: `🎉 Le tirage au sort pour "${tontine.nom}" est terminé ! Votre ordre de passage est le n°${member.position}.`,
      type: 'your_turn'
    });
  });
  await Promise.all(notificationPromises);
};

// Helper function to check if round should advance
exports.checkAndAdvanceRound = async (tontineId) => {
  const tontine = await Tontine.findById(tontineId);
  if (!tontine || tontine.statut !== 'en cours') return;

  const Payment = require('../models/Payment'); // Lazy load to avoid circular dependency
  
  const validatedPaymentsCount = await Payment.countDocuments({
    tontine: tontineId,
    tour: tontine.tourActuel,
    statut: 'validated'
  });

  // If everyone except the current beneficiary has paid
  if (validatedPaymentsCount >= tontine.nombreMembres - 1) {
    if (tontine.tourActuel < tontine.nombreMembres) {
      tontine.tourActuel += 1;
      await tontine.save();
      
      // Notify members of next round
      const nextBeneficiary = await Membre.findOne({ 
        tontineId: tontine._id, 
        position: tontine.tourActuel 
      }).populate('userId');

      const allMembers = await Membre.find({ tontineId: tontine._id });
      for (const m of allMembers) {
        await Notification.create({
          user: m.userId,
          message: `🚀 Nouveau tour pour "${tontine.nom}" ! Le tour n°${tontine.tourActuel} commence. Le bénéficiaire est ${nextBeneficiary.userId.prenom}.`,
          type: 'info'
        });
      }
    } else {
      tontine.statut = 'terminée';
      await tontine.save();
    }
  }
};

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

    // Join tontine (initial position is just index)
    const membre = await Membre.create({
      userId: req.user.id,
      tontineId: tontine._id,
      position: currentMembersCount + 1,
    });

    // Check if tontine is now full to trigger the random draw
    const updatedCount = await Membre.countDocuments({ tontineId: tontine._id });
    
    if (updatedCount === tontine.nombreMembres) {
      await assignPositions(tontine._id, tontine.nombreMembres);
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

    const tontines = membres.map((m) => m.tontineId);

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
