const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tontine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tontine',
    required: true,
  },
  montant: {
    type: Number,
    required: [true, 'Le montant est obligatoire'],
    min: [1, 'Le montant doit être supérieur à 0'],
  },
  tour: {
    type: Number,
    required: true,
  },
  reference: {
    type: String,
    required: [true, 'La référence de transaction est obligatoire'],
    unique: true,
  },
  moyenPaiement: {
    type: String,
    enum: ['Orange Money', 'MTN Mobile Money', 'Moov Money', 'Wave', 'Espèces / Remise directe'],
    required: [true, 'Le moyen de paiement est obligatoire'],
  },
  preuve: {
    type: String, // URL ou chemin de la capture d'écran
  },
  statut: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reason: {
    type: String, // Raison du rejet si applicable
  },
  receiptId: {
    type: String, // ex: PAY-2026-0001
    unique: true,
    sparse: true,
  },
  receiptUrl: {
    type: String, // Chemin vers le fichier PDF généré
  },
  datePaiement: {
    type: Date,
    default: Date.now,
  },
  dateValidation: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
