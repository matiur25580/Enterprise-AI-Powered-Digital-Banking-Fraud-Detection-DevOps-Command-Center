const express = require('express');
const AuditEvent = require('../models/AuditEvent');
const router = express.Router();

// Read-only, bounded audit access. The parent router enforces Admin/RiskManager roles.
router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 50;
  if (!Number.isInteger(page) || page < 1 || page > 10000 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: 'page must be 1–10000 and limit must be 1–100' });
  }
  const filter = {};
  if (req.query.action) {
    const action = String(req.query.action);
    if (!/^[a-z0-9_.-]{1,100}$/i.test(action)) return res.status(400).json({ error: 'Invalid action filter' });
    filter.action = action;
  }
  if (req.query.outcome) {
    const outcome = String(req.query.outcome);
    if (!['success', 'failure', 'blocked'].includes(outcome)) return res.status(400).json({ error: 'Invalid outcome filter' });
    filter.outcome = outcome;
  }
  try {
    const events = await AuditEvent.find(filter)
      .select('actorUserId action outcome subjectHash requestId ipAddress userAgent details createdAt')
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return res.json({ page, limit, events });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load audit events' });
  }
});

module.exports = router;
