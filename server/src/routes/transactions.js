const express = require('express');
const { createHash } = require('crypto');
const axios = require('axios');
const Tx = require('../models/Transaction');
const router = express.Router();

// This prototype records a transfer request only. It does not move funds or debit an account.
// Records a transfer intent for fraud review; this prototype deliberately does not move account funds.
router.post('/transfer', async (req, res) => {
  try {
    const rawAmount = req.body && req.body.amount;
    const amountText = typeof rawAmount === 'number'
      ? String(rawAmount)
      : typeof rawAmount === 'string' ? rawAmount.trim() : '';
    // Transfers are recorded in major currency units with at most two decimal places.
    // Reject exponent notation and excess precision instead of silently rounding money.
    if (!/^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/.test(amountText)) {
      return res.status(400).json({ error: 'Amount must be a positive value with no more than two decimal places' });
    }
    const amount = Number(amountText);
    const recipient = String((req.body && req.body.to) || '').trim();
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000 || !Number.isSafeInteger(Math.round(amount * 100)) || !recipient || recipient.length > 120) {
      return res.status(400).json({ error: 'A valid positive amount and recipient are required' });
    }

    const idempotencyKey = String(req.get('Idempotency-Key') || '').trim();
    if (idempotencyKey && (idempotencyKey.length < 8 || idempotencyKey.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(idempotencyKey))) {
      return res.status(400).json({ error: 'Idempotency-Key must be 8-128 safe characters' });
    }
    const requestFingerprint = createHash('sha256').update(JSON.stringify({ amount, recipient })).digest('hex');
    if (idempotencyKey) {
      const existing = await Tx.findOne({ userId: req.user.id, idempotencyKey });
      if (existing) {
        if (existing.requestFingerprint !== requestFingerprint) {
          return res.status(409).json({ error: 'Idempotency key was already used for a different transfer request', code: 'IDEMPOTENCY_KEY_REUSED' });
        }
        return res.status(202).json({ msg: 'Transfer request was already recorded. No funds have been moved.', tx: existing, idempotentReplay: true });
      }
    }

    let fraudScore;
    let status = 'REVIEW_REQUIRED';
    try {
      const ai = await axios.get('http://localhost:8000/fraud-score', { params: { amount }, timeout: 2500 });
      const candidate = Number(ai.data && (ai.data.score ?? ai.data.fraudScore));
      if (Number.isFinite(candidate) && candidate >= 0 && candidate <= 100) {
        fraudScore = candidate;
        status = candidate > 70 ? 'FLAGGED' : 'REVIEW_REQUIRED';
      }
    } catch (error) {
      // Fail closed: an unavailable fraud service must never imply approval.
    }

    const tx = await Tx.create({
      userId: req.user.id,
      from: req.user.uid,
      to: recipient,
      amount,
      fraudScore,
      status,
      ...(idempotencyKey ? { idempotencyKey, requestFingerprint } : {})
    });
    return res.status(202).json({
      msg: 'Transfer request recorded for review. No funds have been moved.',
      tx
    });
  } catch (error) {
    if (error && error.code === 11000 && req.get('Idempotency-Key')) {
      try {
        const key = String(req.get('Idempotency-Key')).trim();
        const existing = await Tx.findOne({ userId: req.user.id, idempotencyKey: key });
        const amount = Number(req.body && req.body.amount);
        const recipient = String((req.body && req.body.to) || '').trim();
        const fingerprint = createHash('sha256').update(JSON.stringify({ amount, recipient })).digest('hex');
        if (existing && existing.requestFingerprint === fingerprint) {
          return res.status(202).json({ msg: 'Transfer request was already recorded. No funds have been moved.', tx: existing, idempotentReplay: true });
        }
        if (existing) return res.status(409).json({ error: 'Idempotency key was already used for a different transfer request', code: 'IDEMPOTENCY_KEY_REUSED' });
      } catch (lookupError) {
        return res.status(500).json({ error: 'Unable to verify transfer request status' });
      }
    }
    return res.status(500).json({ error: 'Unable to record transfer request' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const list = await Tx.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50).lean();
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load transactions' });
  }
});

module.exports = router;
