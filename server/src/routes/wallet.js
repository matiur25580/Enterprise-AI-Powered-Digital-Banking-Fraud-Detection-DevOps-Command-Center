const express = require('express');
const router = express.Router();
const rates = Object.freeze({ USD: 1, EUR: 0.92, INR: 83.2 });

router.get('/rates', (req, res) => res.json({ rates, source: 'static demonstration rates; not live FX quotes' }));
router.post('/convert', (req, res) => {
  const { from, to, amount } = req.body || {};
  const value = Number(amount);
  if (!Object.prototype.hasOwnProperty.call(rates, from) || !Object.prototype.hasOwnProperty.call(rates, to)) {
    return res.status(400).json({ error: 'Unsupported currency. Supported currencies: USD, EUR, INR.' });
  }
  if (!Number.isFinite(value) || value <= 0 || value > 1000000000) {
    return res.status(400).json({ error: 'Amount must be a positive number within the supported limit.' });
  }
  const result = Number(((value / rates[from]) * rates[to]).toFixed(2));
  return res.json({ result, from, to, amount: value, disclaimer: 'Illustrative conversion using static demo rates. Not a financial quote or transaction.' });
});

module.exports = router;
