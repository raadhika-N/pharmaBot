const prisma = require('../config/db');
const { extractTextFromImage } = require('../services/ocrService');
const path = require('path');

// POST /api/prescriptions/:id/ocr
const runOCR = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    if (prescription.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    if (!prescription.filePath) {
      return res.status(400).json({
        error: 'This prescription has no uploaded file. OCR requires an image or PDF.'
      });
    }

    // Only run OCR on images (PDF OCR needs extra setup, image is the common case)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(prescription.fileType)) {
      return res.status(400).json({
        error: 'OCR currently supports JPG and PNG images only.'
      });
    }

    console.log(`\n🔍 Running OCR on prescription ${id}`);
    const absolutePath = path.resolve(prescription.filePath);

    const extractedText = await extractTextFromImage(absolutePath);

    if (!extractedText || extractedText.length < 5) {
      return res.status(422).json({
        error: 'OCR could not read meaningful text from this image. Try a clearer photo.'
      });
    }

    // Save extracted text to rawText so Phase 3 extraction can use it
    const updated = await prisma.prescription.update({
      where: { id },
      data: { rawText: extractedText }
    });

    console.log(`✅ OCR complete. Extracted ${extractedText.length} characters.`);

    res.json({
      message: 'Text extracted from image successfully.',
      extractedText,
      prescription: updated,
      hint: `Now run POST /api/prescriptions/${id}/extract to identify drug names.`
    });

  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to process image with OCR.' });
  }
};

module.exports = { runOCR };