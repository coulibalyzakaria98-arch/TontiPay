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
  },
  reference: {
    type: String,
    required: [true, 'La référence de transaction est obligatoire'],
  },
  preuve: {
    type: String, // URL or path to the screenshot
  },
  statut: {
    type: String,
    enum: ['pending', 'validated', 'rejected'],
    default: 'pending',
  },
  datePaiement: {
    type: Date,
    default: Date.now,
  },
  dateValidation: {
    type: Date,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
