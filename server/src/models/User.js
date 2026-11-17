const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true, enum: ['Customer', 'Admin', 'RiskManager', 'SupportAgent'] },
  dob: String
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model('User', userSchema);
