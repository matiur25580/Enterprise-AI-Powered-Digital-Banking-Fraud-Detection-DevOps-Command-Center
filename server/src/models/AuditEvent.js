const mongoose = require('mongoose');

const auditEventSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  action: { type: String, required: true, maxlength: 100, index: true },
  outcome: { type: String, enum: ['success', 'failure', 'blocked'], required: true },
  subjectHash: { type: String, maxlength: 64, default: null },
  requestId: { type: String, maxlength: 100, default: null },
  ipAddress: { type: String, maxlength: 64, default: null },
  userAgent: { type: String, maxlength: 300, default: null },
  details: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });

auditEventSchema.index({ createdAt: -1 });
auditEventSchema.index({ actorUserId: 1, createdAt: -1 });
auditEventSchema.index({ action: 1, createdAt: -1 });
module.exports = mongoose.model('AuditEvent', auditEventSchema);
