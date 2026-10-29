const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  dob: String,
}, { timestamps: true });
userSchema.index({ email: 1, role: 1 }, { unique: true });
const User=mongoose.model('User', userSchema);
User.syncIndexes().then(()=>console.log('Indexes synced')).catch(()=>{});
module.exports = User;
