const express = require('express');
const router = express.Router();

// Disabled until persistent storage, ownership checks, audit trails and integration tests exist.
router.use((req, res) => res.status(501).json({
  error: 'twofa is temporarily unavailable',
  code: 'FEATURE_NOT_READY',
  message: 'This operation is not implemented as a secure production workflow. No data or funds were changed.'
}));

module.exports = router;
