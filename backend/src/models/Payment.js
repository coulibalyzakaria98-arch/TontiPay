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
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  method: {
    type: String,
    enum: ['orange', 'mtn', 'moov', 'wave', 'cash'],
    required: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
  },
  receiptUrl: {
    type: String,
  },
  receiptId: {
    type: String,
    unique: true,
    sparse: true,
  },
  tour: {
    type: Number,
    required: true,
  },
  validatedAt: {
    type: Date,
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
