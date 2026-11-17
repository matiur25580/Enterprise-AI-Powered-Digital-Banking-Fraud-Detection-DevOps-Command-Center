const express = require('express');
const router = express.Router();

// This placeholder is deliberately disabled: it returned mock or unscoped data.
router.use((req, res) => res.status(501).json({
  error: 'creditScore is temporarily unavailable',
  code: 'FEATURE_NOT_READY',
  message: 'A persistent, authorized and audited implementation is required before this feature can be enabled.'
}));

module.exports = router;
