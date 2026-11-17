const mongoose = require('mongoose');

const refreshSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  familyId: { type: String, required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  replacedByHash: { type: String, default: null },
  revokedAt: { type: Date, default: null },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  userAgent: { type: String, maxlength: 300 },
  ipAddress: { type: String, maxlength: 64 }
}, { timestamps: true });

refreshSessionSchema.index({ userId: 1, familyId: 1, revokedAt: 1 });
module.exports = mongoose.model('RefreshSession', refreshSessionSchema);
