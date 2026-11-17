const express = require('express');
const router = express.Router();
router.use((req, res) => res.status(501).json({ error: 'chatbot is temporarily unavailable', code: 'FEATURE_NOT_READY', message: 'The previous chatbot returned hard-coded financial information and is disabled until connected to authorized account data.' }));
module.exports = router;
