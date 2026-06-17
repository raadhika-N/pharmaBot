const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateReport,
  getReport,
  getAllReports
} = require('../controllers/reportController');

// Generate or get report for a prescription
router.post('/prescriptions/:id/report', protect, generateReport);
router.get('/prescriptions/:id/report', protect, getReport);

// Get all reports for current user
router.get('/reports', protect, getAllReports);

module.exports = router;