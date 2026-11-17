const express = require('express');
const axios = require('axios');
const Tx = require('../models/Transaction');
const router = express.Router();

// This prototype records a transfer request only. It does not move funds or debit an account.
router.post('/transfer', async (req, res) => {
  try {
    const amount = Number(req.body && req.body.amount);
    const recipient = String((req.body && req.body.to) || '').trim();
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000 || !recipient || recipient.length > 120) {
      return res.status(400).json({ error: 'A valid positive amount and recipient are required' });
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
      status
    });
    return res.status(202).json({
      msg: 'Transfer request recorded for review. No funds have been moved.',
      tx
    });
  } catch (error) {
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
