const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: String,
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true },
  dob: String
}, { timestamps: true });

// Retain the existing compound unique index to avoid an unsafe production index migration.
userSchema.index({ email: 1, role: 1 }, { unique: true });
module.exports = mongoose.model('User', userSchema);
