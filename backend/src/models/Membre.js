const mongoose = require('mongoose');

const membreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  tontineId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tontine',
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  ordreArrivee: {
    type: Number,
    default: 1,
  },
  aRecu: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user can only be in a tontine once
membreSchema.index({ userId: 1, tontineId: 1 }, { unique: true });

module.exports = mongoose.model('Membre', membreSchema);
