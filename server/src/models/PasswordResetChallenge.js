const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0, min: 0, max: 5 },
  consumedAt: { type: Date, default: null },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true });

passwordResetSchema.index({ email: 1, consumedAt: 1, createdAt: -1 });
module.exports = mongoose.model('PasswordResetChallenge', passwordResetSchema);
