const prisma = require('../config/db');
const { extractDrugsFromText } = require('../services/extractionService');

// POST /api/prescriptions/:id/extract
const extractDrugs = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the prescription
    const prescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    // Make sure it belongs to this user
    if (prescription.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    // Make sure there is text to extract from
    if (!prescription.rawText) {
      return res.status(400).json({
        error:
          'This prescription has no text to extract from. Please provide rawText when uploading.'
      });
    }

    // Already extracted — don't waste API credits
    if (
      prescription.status === 'extracted' &&
      prescription.drugs &&
      prescription.drugs.length > 0
    ) {
      return res.json({
        message: 'Drugs already extracted.',
        prescription
      });
    }

    // Call the AI
    const drugs = await extractDrugsFromText(prescription.rawText);

    if (drugs.length === 0) {
      // Update status but save empty array
      const updated = await prisma.prescription.update({
        where: { id },
        data: {
          drugs: [],
          status: 'extracted'
        }
      });

      return res.json({
        message: 'No drug names found in this prescription.',
        prescription: updated
      });
    }

    // Save extracted drugs back to DB
    const updated = await prisma.prescription.update({
      where: { id },
      data: {
        drugs,
        status: 'extracted'
      }
    });

    return res.json({
      message: `Successfully extracted ${drugs.length} drug(s).`,
      drugsFound: drugs,
      prescription: updated
    });

  } catch (error) {
    console.error('Extraction error:', error);

    // OpenAI specific errors
    if (error?.status === 401) {
      return res.status(500).json({
        error: 'Invalid OpenAI API key.'
      });
    }

    // Check quota error BEFORE generic 429
    if (
      error?.status === 429 &&
      error?.code === 'insufficient_quota'
    ) {
      return res.status(500).json({
        error: 'OpenAI quota exceeded. Check your billing.'
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({
        error: 'OpenAI rate limit hit. Please try again in a moment.'
      });
    }

    return res.status(500).json({
      error: 'Failed to extract drugs.'
    });
  }
};

module.exports = { extractDrugs };