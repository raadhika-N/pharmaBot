const prisma = require('../config/db');
const { retrieveEvidenceForDrugs } = require('../services/ragService');

// GET /api/prescriptions/:id/citations
const getCitations = async (req, res) => {
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

    if (!prescription.drugs || prescription.drugs.length < 2) {
      return res.status(400).json({
        error: 'Need at least 2 extracted drugs to show citations.'
      });
    }

    const ragResults = await retrieveEvidenceForDrugs(prescription.drugs);

    const citations = ragResults.pairs.map(pair => ({
      drugPair: `${pair.drugA} + ${pair.drugB}`,
      sources: pair.evidence.map(e => ({
        type: e.type === 'exact_match' ? 'Database Record' : 'Semantic Match',
        excerpt: e.content,
        confidence: parseFloat((e.confidence || 0).toFixed(3)),
        source: e.source || 'PharmaBot Knowledge Base',
        severity: e.severity
      }))
    }));

    res.json({
      prescriptionId: id,
      drugs: prescription.drugs,
      citations
    });

  } catch (error) {
    console.error('Citations error:', error);
    res.status(500).json({ error: 'Failed to fetch citations.' });
  }
};

module.exports = { getCitations };