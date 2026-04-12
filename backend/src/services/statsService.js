const Tontine = require('../models/Tontine');
const Membre = require('../models/Membre');
const Payment = require('../models/Payment');

class StatsService {
  /**
   * Statistiques globales pour le Dashboard utilisateur
   */
  async getUserGlobalStats(userId) {
    // 1. Nombre de tontines actives
    const tontinesParticipated = await Membre.find({ userId }).populate('tontineId');
    const activeTontines = tontinesParticipated.filter(m => m.tontineId && m.tontineId.statut === 'en cours');
    
    // 2. Total versé (toutes tontines confondues)
    const approvedPayments = await Payment.find({ 
      user: userId, 
      status: 'valide' 
    });
    const totalVersé = approvedPayments.reduce((sum, p) => sum + p.montant, 0);

    // 3. Prochains pots à recevoir
    const upcomingPayouts = tontinesParticipated
      .filter(m => m.tontineId && m.tontineId.statut === 'en cours' && m.position >= m.tontineId.tourActuel)
      .map(m => ({
        tontineNom: m.tontineId.nom,
        montantPot: m.tontineId.montant * (m.tontineId.nombreMembres - 1),
        position: m.position,
        tourActuel: m.tontineId.tourActuel,
        estProchain: m.position === m.tontineId.tourActuel
      }));

    return {
      activeTontinesCount: activeTontines.length,
      totalVersé,
      upcomingPayouts,
      totalTontinesParticipated: tontinesParticipated.length
    };
  }

  /**
   * Statistiques pour l'administrateur d'une tontine spécifique
   */
  async getTontineAdminStats(tontineId) {
    const tontine = await Tontine.findById(tontineId);
    if (!tontine) throw new Error('Tontine non trouvée');

    const totalCollectéCeTour = await Payment.find({
      tontine: tontineId,
      tour: tontine.tourActuel,
      status: 'valide'
    }).then(payments => payments.reduce((sum, p) => sum + p.montant, 0));

    const totalAttenduParTour = tontine.montant * (tontine.nombreMembres - 1);

    return {
      tourActuel: tontine.tourActuel,
      totalCollectéCeTour,
      totalAttenduParTour,
      progressionTour: Math.round((totalCollectéCeTour / totalAttenduParTour) * 100) || 0,
      statut: tontine.statut
    };
  }
}

module.exports = new StatsService();
