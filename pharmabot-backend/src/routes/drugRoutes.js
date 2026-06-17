const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllDrugs, getDrugByName, checkInteractions } = require('../controllers/drugController');

router.use(protect);

router.get('/', getAllDrugs);
router.get('/:name', getDrugByName);
router.post('/check-interactions', checkInteractions);

module.exports = router;