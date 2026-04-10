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
      const activeTontines = await Tontine.find({ statut: { $in: ['en attente', 'en cours'] } });
      
      for (const tontine of activeTontines) {
        const { nextDueDate, daysRemaining } = getNextPeriodInfo(tontine.dateDebut, tontine.frequence);
        
        // On cible les rappels à J-1 et Jour J
        if (daysRemaining !== 1 && daysRemaining !== 0) continue;

        const members = await Membre.find({ tontineId: tontine._id });
        
        for (const member of members) {
          // Vérifier si un paiement VALIDE existe déjà pour cette période
          // On considère la période comme les X derniers jours selon la fréquence
          const lookbackDate = new Date();
          lookbackDate.setDate(lookbackDate.getDate() - (tontine.frequence === 'hebdomadaire' ? 7 : 30));

          const hasPaid = await Payment.findOne({
            user: member.userId,
            tontine: tontine._id,
            statut: 'validated',
            datePaiement: { $gte: lookbackDate }
          });

          if (!hasPaid) {
            const message = daysRemaining === 0 
              ? `🚨 JOUR J : C'est le dernier moment pour payer votre cotisation de ${tontine.montant.toLocaleString()} FCFA pour "${tontine.nom}" !`
              : `⏰ RAPPEL : Votre cotisation de ${tontine.montant.toLocaleString()} FCFA pour "${tontine.nom}" est attendue demain.`;

            await Notification.create({
              user: member.userId,
              message,
              type: 'reminder'
            });
            
            console.log(`Notification envoyée à ${member.userId} pour ${tontine.nom}`);
          }
        }
      }
      console.log('--- FIN CRON : Rappels Terminés ---');
    } catch (error) {
      console.error('Erreur Cron Job:', error);
    }
  });

  console.log('Service de Rappels Automatiques Initialisé (8h00 daily)');
};

module.exports = initCronJobs;
