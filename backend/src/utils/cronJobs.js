const cron = require('node-cron');
const Tontine = require('../models/Tontine');
const Membre = require('../models/Membre');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

/**
 * Calcul de la date d'échéance suivante basée sur la fréquence
 */
const getNextPeriodInfo = (startDate, frequency) => {
  const start = new Date(startDate);
  const now = new Date();
  let nextDueDate = new Date(start);
  
  if (frequency === 'hebdomadaire') {
    while (nextDueDate < now) {
      nextDueDate.setDate(nextDueDate.getDate() + 7);
    }
  } else if (frequency === 'mensuelle') {
    while (nextDueDate < now) {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    }
  }
  
  const diffDays = Math.ceil((nextDueDate - now) / (1000 * 60 * 60 * 24));
  return { nextDueDate, daysRemaining: diffDays };
};

const initCronJobs = () => {
  // Tous les jours à 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('--- DÉBUT CRON : Rappels Automatiques ---');
    
    try {
      const activeTontines = await Tontine.find({ statut: 'en cours' });
      
      for (const tontine of activeTontines) {
        const { nextDueDate, daysRemaining } = getNextPeriodInfo(tontine.dateDebut, tontine.frequence);
        
        // 1. Gérer le passage au tour suivant si la date d'échéance est passée (ex: on est le jour J+1 de l'échéance précédente)
        // Pour simplifier, on se base sur le tour actuel et la position
        
        // On cible les rappels à J-2, J-1 et Jour J
        if (![2, 1, 0].includes(daysRemaining)) continue;

        const beneficiary = await Membre.findOne({ 
          tontineId: tontine._id, 
          position: tontine.tourActuel 
        }).populate('userId');

        if (!beneficiary) continue;

        const members = await Membre.find({ tontineId: tontine._id });
        
        for (const member of members) {
          // Si c'est le bénéficiaire
          if (member.userId.toString() === beneficiary.userId._id.toString()) {
            if (daysRemaining === 0) {
              await Notification.create({
                user: member.userId,
                message: `💰 C'est votre tour ! Aujourd'hui, vous recevez le pot de "${tontine.nom}".`,
                type: 'your_turn'
              });
            }
            continue;
          }

          // Vérifier si un paiement VALIDE existe déjà pour ce tour précis
          const hasPaid = await Payment.findOne({
            user: member.userId,
            tontine: tontine._id,
            tour: tontine.tourActuel,
            statut: 'validated'
          });

          if (!hasPaid) {
            let message = '';
            if (daysRemaining === 2) {
              message = `⏰ RAPPEL : Plus que 2 jours pour verser votre cotisation de ${tontine.montant.toLocaleString()} FCFA pour "${tontine.nom}".`;
            } else if (daysRemaining === 1) {
              message = `⚠️ URGENT : Votre cotisation de ${tontine.montant.toLocaleString()} FCFA pour "${tontine.nom}" est attendue demain.`;
            } else if (daysRemaining === 0) {
              message = `🚨 DERNIER DÉLAI : C'est aujourd'hui le dernier moment pour payer votre cotisation pour "${tontine.nom}". Ce tour est pour ${beneficiary.userId.prenom} !`;
            }

            if (message) {
              await Notification.create({
                user: member.userId,
                message,
                type: 'reminder'
              });
            }
          }
        }
        // 3. Vérifier si tout le monde a payé pour passer au tour suivant automatiquement
        const { checkAndAdvanceRound } = require('../controllers/tontineController');
        await checkAndAdvanceRound(tontine._id);
      }
      console.log('--- FIN CRON : Rappels Terminés ---');
    } catch (error) {
      console.error('Erreur Cron Job:', error);
    }
  });

  console.log('Service de Rappels Automatiques Initialisé (8h00 daily)');
};

module.exports = initCronJobs;
