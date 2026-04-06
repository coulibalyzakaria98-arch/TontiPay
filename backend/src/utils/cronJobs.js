const cron = require('node-cron');
const Tontine = require('../models/Tontine');
const Membre = require('../models/Membre');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

const initCronJobs = () => {
  // Every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily reminder cron job...');
    
    try {
      const activeTontines = await Tontine.find({ statut: 'en cours' });
      
      for (const tontine of activeTontines) {
        // Logic to check who needs to pay
        // This is a simplified version: notify all members of active tontines
        const members = await Membre.find({ tontineId: tontine._id });
        
        for (const member of members) {
          // Check if user already paid for the current period (simplified)
          // In a real scenario, you'd check specifically for the current month/week
          
          await Notification.create({
            user: member.userId,
            message: `Rappel : N'oubliez pas votre cotisation pour la tontine "${tontine.nom}" ce mois-ci.`,
            type: 'reminder'
          });
        }
      }
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });

  console.log('Cron jobs initialized');
};

module.exports = initCronJobs;
