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
    const tontine = await Tontine.findById(tontineId);
    if (!tontine) return;

    const members = await Membre.find({ tontineId }).sort('ordreArrivee');
    
    if (tontine.typeTirage === 'ordre_arrivee') {
      // Cas 1 : Ordre d'arrivée (Premier inscrit, premier servi)
      const savePromises = members.map((member, index) => {
        member.position = index + 1; // On se base sur l'index du tri par ordreArrivee
        return member.save();
      });
      await Promise.all(savePromises);
    } else {
      // Cas 2 : Tirage au sort aléatoire (Hasard pur)
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
    }

    // Mise à jour du statut de la tontine
    tontine.statut = 'en cours';
    tontine.tourActuel = 1;
    await tontine.save();

    // Notifications des membres
    const updatedMembers = await Membre.find({ tontineId }).sort('position');
    const notificationPromises = updatedMembers.map(member => {
      return Notification.create({
        user: member.userId,
        message: `🎉 Le tirage au sort pour "${tontine.nom}" est terminé (${tontine.typeTirage === 'aleatoire' ? 'Aléatoire' : 'Ordre d\'arrivée'}) ! Votre ordre de passage est le n°${member.position}.`,
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
      statut: 'approved'
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
