require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const APPLY = process.argv.includes('--apply');
const BCRYPT_RE = /^\$2[aby]\$\d{2}\$/;
const ARGON2_RE = /^\$argon2(id|i|d)\$/;

async function migrate() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  if (APPLY && (process.env.CONFIRM_PRODUCTION_BACKUP !== 'YES' || process.env.CONFIRM_RESTORE_TEST !== 'YES')) {
    throw new Error('Refusing --apply: set CONFIRM_PRODUCTION_BACKUP=YES and CONFIRM_RESTORE_TEST=YES only after verifying a restorable backup.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  const counts = { scanned: 0, candidates: 0, migrated: 0, bcryptSkipped: 0, argon2Skipped: 0, emptySkipped: 0, changedDuringRun: 0 };
  try {
    const cursor = User.find({}).select('+password').lean().cursor();
    for await (const user of cursor) {
      counts.scanned += 1;
      const stored = String(user.password || '');
      if (!stored) { counts.emptySkipped += 1; continue; }
      if (BCRYPT_RE.test(stored)) { counts.bcryptSkipped += 1; continue; }
      if (ARGON2_RE.test(stored)) { counts.argon2Skipped += 1; continue; }

      if (!APPLY) {
        counts.candidates += 1;
        continue;
      }

      const passwordHash = await bcrypt.hash(stored, 12);
      const result = await User.updateOne(
        { _id: user._id, password: user.password },
        { $set: { password: passwordHash } }
      );
      if (result.modifiedCount === 1) counts.migrated += 1;
      else counts.changedDuringRun += 1;
    }
    process.stdout.write(JSON.stringify({
      mode: APPLY ? 'APPLY' : 'DRY_RUN',
      ...counts,
      note: 'No credentials or user identifiers are printed. Argon2 hashes are left untouched and require Argon2 verification support or a controlled reset.'
    }, null, 2) + '\n');
  } finally {
    await mongoose.disconnect();
  }
}

migrate().catch(error => {
  console.error('Password migration failed:', error.message);
  process.exitCode = 1;
});
