const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { analysePrescription } = require('../controllers/analysisController');

router.post('/:id/analyse', protect, analysePrescription);

module.exports = router;