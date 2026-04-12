const Tontine = require('../models/Tontine');
const Membre = require('../models/Membre');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');

/**
 * Service gérant la logique métier complexe des tontines
 */
class TontineService {
  /**
   * Effectue le tirage au sort et assigne les positions aux membres
   */
  async assignPositions(tontineId, nombreMembres) {
    const members = await Membre.find({ tontineId });
    
    // Préparation des positions [1, 2, ..., n]
    const positions = Array.from({ length: nombreMembres }, (_, i) => i + 1);
    
    // Fisher-Yates shuffle
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Assignation et sauvegarde
    const savePromises = members.map((member, index) => {
      member.position = positions[index];
      return member.save();
    });

    await Promise.all(savePromises);

    // Mise à jour du statut de la tontine
    const tontine = await Tontine.findByIdAndUpdate(
      tontineId, 
      { statut: 'en cours', tourActuel: 1 },
      { new: true }
    );

    // Notifications des membres
    const notificationPromises = members.map(member => {
      return Notification.create({
        user: member.userId,
        message: `🎉 Le tirage au sort pour "${tontine.nom}" est terminé ! Votre ordre de passage est le n°${member.position}.`,
        type: 'your_turn'
      });
    });
    
    await Promise.all(notificationPromises);
    return tontine;
  }

  /**
   * Vérifie si tous les paiements du tour actuel sont validés pour passer au tour suivant
   */
  async checkAndAdvanceRound(tontineId) {
    const tontine = await Tontine.findById(tontineId);
    if (!tontine || tontine.statut !== 'en cours') return;

    const validatedPaymentsCount = await Payment.countDocuments({
      tontine: tontineId,
      tour: tontine.tourActuel,
      statut: 'validated'
    });

    // Règle métier : n-1 paiements validés (tout le monde sauf le bénéficiaire)
    if (validatedPaymentsCount >= tontine.nombreMembres - 1) {
      if (tontine.tourActuel < tontine.nombreMembres) {
        tontine.tourActuel += 1;
        await tontine.save();
        
        // Notification du nouveau tour
        const nextBeneficiary = await Membre.findOne({ 
          tontineId: tontine._id, 
          position: tontine.tourActuel 
        }).populate('userId');

        const allMembers = await Membre.find({ tontineId: tontine._id });
        const notificationPromises = allMembers.map(m => {
            return Notification.create({
                user: m.userId,
                message: `🚀 Nouveau tour pour "${tontine.nom}" ! Le tour n°${tontine.tourActuel} commence. Le bénéficiaire est ${nextBeneficiary.userId.prenom}.`,
                type: 'info'
            });
        });
        await Promise.all(notificationPromises);
      } else {
        tontine.statut = 'terminée';
        await tontine.save();
      }
    }
    return tontine;
  }
}

module.exports = new TontineService();
