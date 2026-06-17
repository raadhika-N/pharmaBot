const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { classifyPrescription } = require('../controllers/classifierController');

router.post('/:id/classify', protect, classifyPrescription);

module.exports = router;