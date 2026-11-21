const crypto = require('crypto');
const AuditEvent = require('../models/AuditEvent');

function hashSubject(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

async function recordSecurityEvent(req, event) {
  try {
    await AuditEvent.create({
      actorUserId: event.actorUserId || null,
      action: event.action,
      outcome: event.outcome,
      subjectHash: event.subjectHash || null,
      requestId: String(req.get('x-request-id') || '').slice(0, 100) || null,
      ipAddress: String(req.ip || '').slice(0, 64) || null,
      userAgent: String(req.get('user-agent') || '').slice(0, 300) || null,
      details: event.details || {}
    });
  } catch (error) {
    // Do not leak credentials or interrupt authentication responses; monitor this alert in production.
    process.stderr.write('Security audit event could not be persisted.\\n');
  }
}

module.exports = { recordSecurityEvent, hashSubject };
