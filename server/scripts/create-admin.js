require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

async function createAdmin() {
  const email = String(process.env.BOOTSTRAP_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const name = String(process.env.BOOTSTRAP_ADMIN_NAME || 'TrustShield Administrator').trim();
  if (!email || !password || password.length < 16) {
    throw new Error('Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD (minimum 16 characters) for this one-time command');
  }
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const existing = await User.findOne({ email }).select('_id');
    if (existing) throw new Error('This email is already associated with an account; use the approved account-provisioning process');
    const passwordHash = await bcrypt.hash(password, 12);
    const uid = 'ADM' + crypto.randomBytes(6).toString('hex').toUpperCase();
    const user = await User.create({ uid, name, email, password: passwordHash, role: 'Admin' });
    process.stdout.write('Admin account created. UID: ' + user.uid + '\n');
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin().catch(error => {
  console.error('Admin provisioning failed:', error.message);
  process.exitCode = 1;
});
