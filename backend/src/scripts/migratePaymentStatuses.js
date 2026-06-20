// backend/src/scripts/migratePaymentStatuses.js

const mongoose = require('mongoose');
const Payment = require('../models/Payment');
require('dotenv').config();

/**
 * Script de migration pour mettre à jour les statuts de paiement
 * de 'valide'/'rejete'/'en_attente' vers 'approved'/'rejected'/'pending'
 */
async function migratePaymentStatuses() {
  try {
    console.log('🔄 Début de la migration des statuts de paiement...');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tontipay';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion à MongoDB établie');
    
    // Migration des statuts
    const statusMapping = {
      'valide': 'approved',
      'rejete': 'rejected',
      'en_attente': 'pending'
    };
    
    let totalModified = 0;
    
    for (const [oldStatus, newStatus] of Object.entries(statusMapping)) {
      const result = await Payment.updateMany(
        { status: oldStatus },
        { status: newStatus }
      );
      totalModified += result.modifiedCount;
      console.log(`✅ ${result.modifiedCount} paiements migrés de '${oldStatus}' vers '${newStatus}'`);
    }
    
    // Migration du champ montant vers amount pour la rétrocompatibilité
    const paymentsWithMontant = await Payment.find({ montant: { $exists: true } });
    let amountMigrationCount = 0;
    
    for (const payment of paymentsWithMontant) {
      if (!payment.amount) {
        payment.amount = payment.montant;
        payment.montant = undefined;
        await payment.save();
        amountMigrationCount++;
      }
    }
    console.log(`✅ ${amountMigrationCount} paiements migrés de 'montant' vers 'amount'`);
    
    console.log(`✅ Migration terminée. Total: ${totalModified} statuts modifiés, ${amountMigrationCount} champs modifiés`);
    
    await mongoose.disconnect();
    console.log('✅ Déconnexion de MongoDB');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migratePaymentStatuses();
