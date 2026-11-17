const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  fraudScore: { type: Number, min: 0, max: 100 },
  status: { type: String, enum: ['REVIEW_REQUIRED', 'FLAGGED', 'APPROVED'], default: 'REVIEW_REQUIRED' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
