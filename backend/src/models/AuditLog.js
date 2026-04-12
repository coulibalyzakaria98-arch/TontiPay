const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true, // e.g., "PAYMENT_APPROVED", "PAYMENT_REJECTED"
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
