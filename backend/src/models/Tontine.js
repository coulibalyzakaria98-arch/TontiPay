const mongoose = require('mongoose');

const tontineSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Veuillez ajouter un nom pour la tontine'],
    trim: true,
  },
  montant: {
    type: Number,
    required: [true, 'Veuillez ajouter un montant de cotisation'],
  },
  frequence: {
    type: String,
    required: [true, 'Veuillez choisir une fréquence'],
    enum: ['hebdomadaire', 'mensuelle'],
  },
  nombreMembres: {
    type: Number,
    required: [true, 'Veuillez ajouter le nombre de membres'],
  },
  dateDebut: {
    type: Date,
    required: [true, 'Veuillez ajouter une date de début'],
  },
  createur: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  statut: {
    type: String,
    enum: ['en attente', 'en cours', 'terminée'],
    default: 'en attente',
  },
  tourActuel: {
    type: Number,
    default: 1,
  },
  code: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate a random 6-character code before saving
tontineSchema.pre('save', async function (next) {
  if (!this.code) {
    this.code = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Tontine', tontineSchema);
