require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

async function migrate() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  await mongoose.connect(process.env.MONGO_URI);
  let migrated = 0;
  let skipped = 0;
  try {
    const users = await User.find({}).select('+password');
    for (const user of users) {
      const stored = String(user.password || '');
      if (!stored) { skipped += 1; continue; }
      if (/^\$2[aby]\$\d{2}\$/.test(stored) || /^\$argon2(id|i|d)\$/.test(stored)) {
        skipped += 1;
        continue;
      }
      user.password = await bcrypt.hash(stored, 12);
      await user.save();
      migrated += 1;
    }
    process.stdout.write('Password migration complete. Migrated: ' + migrated + ', skipped: ' + skipped + '\n');
  } finally {
    await mongoose.disconnect();
  }
}

migrate().catch(error => {
  console.error('Password migration failed:', error.message);
  process.exitCode = 1;
});
