const mongoose = require('mongoose');

// Transaction records preserve the fraud-review outcome and an idempotency fingerprint for safe retries.
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  fraudScore: { type: Number, min: 0, max: 100 },
  status: { type: String, enum: ['REVIEW_REQUIRED', 'FLAGGED', 'APPROVED'], default: 'REVIEW_REQUIRED' },
  idempotencyKey: { type: String, minlength: 8, maxlength: 128 },
  requestFingerprint: { type: String, match: /^[a-f0-9]{64}$/ }
}, { timestamps: true });

transactionSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } }
);

module.exports = mongoose.model('Transaction', transactionSchema);
