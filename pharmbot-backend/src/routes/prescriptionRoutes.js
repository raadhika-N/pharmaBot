const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const {
  uploadPrescription,
  getAllPrescriptions,
  getPrescription,
  deletePrescription
} = require('../controllers/prescriptionController');
const { extractDrugs } = require('../controllers/extractionController');

router.use(protect);

router.post('/upload', upload.single('prescription'), uploadPrescription);
router.get('/', getAllPrescriptions);
router.get('/:id', getPrescription);
router.delete('/:id', deletePrescription);
router.post('/:id/extract', extractDrugs); 

module.exports = router;