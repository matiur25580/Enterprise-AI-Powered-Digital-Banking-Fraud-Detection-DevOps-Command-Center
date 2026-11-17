const express = require('express');
const router = express.Router();

router.get('/statement/:userId', (req, res) => {
  if (req.user.role !== 'Admin' && req.params.userId !== req.user.uid) {
    return res.status(403).json({ error: 'You may only access your own statement' });
  }
  return res.status(501).json({ error: 'Statement generation is not implemented yet' });
});

module.exports = router;
