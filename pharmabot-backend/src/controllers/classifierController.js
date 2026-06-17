const prisma = require('../config/db');
const { retrieveEvidenceForDrugs } = require('../services/ragService');
const { classifyAllInteractions } = require('../services/classifierService');

// POST /api/prescriptions/:id/classify
const classifyPrescription = async (req, res) => {
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

    if (!prescription.drugs || prescription.drugs.length === 0) {
      return res.status(400).json({
        error: 'No drugs found. Please run extraction first.',
        hint: `POST /api/prescriptions/${id}/extract`
      });
    }

    if (prescription.drugs.length < 2) {
      return res.status(400).json({
        error: 'At least 2 drugs needed to check interactions.',
        drugsFound: prescription.drugs
      });
    }

    console.log(`\n🔬 Classifying prescription ${id}`);
    console.log(`💊 Drugs: ${prescription.drugs.join(', ')}`);

    // Step 1 — Retrieve evidence (RAG)
    console.log('📚 Step 1: Retrieving evidence...');
    const ragResults = await retrieveEvidenceForDrugs(prescription.drugs);

    if (ragResults.pairs.length === 0) {
      await prisma.prescription.update({
        where: { id },
        data: { status: 'classified' }
      });

      return res.json({
        message: 'No known interactions found between these drugs.',
        prescriptionId: id,
        drugs: prescription.drugs,
        classifications: [],
        summary: {
          total: 0,
          high: 0,
          moderate: 0,
          low: 0
        }
      });
    }

    // Step 2 — Classify each interaction with Groq
    console.log(`🤖 Step 2: Classifying ${ragResults.pairs.length} interaction(s)...`);
    const classifications = await classifyAllInteractions(ragResults);

    // Step 3 — Update prescription status
    await prisma.prescription.update({
      where: { id },
      data: { status: 'classified' }
    });

    // Build summary
    const summary = {
      total: classifications.length,
      high: classifications.filter(c => c.severity === 'High').length,
      moderate: classifications.filter(c => c.severity === 'Moderate').length,
      low: classifications.filter(c => c.severity === 'Low').length,
      none: classifications.filter(c => c.severity === 'None').length
    };

    res.json({
      message: `Classification complete. Found ${classifications.length} interaction(s).`,
      prescriptionId: id,
      drugs: prescription.drugs,
      summary,
      classifications
    });

  } catch (error) {
    console.error('Classifier error:', error);

    if (error?.status === 429) {
      return res.status(429).json({
        error: 'AI rate limit hit. Please wait a moment and try again.'
      });
    }

    res.status(500).json({ error: 'Failed to classify interactions.' });
  }
};

module.exports = { classifyPrescription };