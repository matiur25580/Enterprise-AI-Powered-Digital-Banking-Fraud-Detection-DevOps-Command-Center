const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: String,
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true },
  tokenVersion: { type: Number, default: 0, min: 0 },
  dob: String
}, { timestamps: true });

userSchema.index({ email: 1, role: 1 }, { unique: true });
module.exports = mongoose.model('User', userSchema);
