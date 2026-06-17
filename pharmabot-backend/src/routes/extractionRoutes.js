const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { extractDrugs } = require('../controllers/extractionController');

// POST /api/prescriptions/:id/extract
router.post('/:id/extract', protect, extractDrugs);

module.exports = router;