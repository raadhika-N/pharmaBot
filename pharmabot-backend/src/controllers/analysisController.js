const prisma = require('../config/db');
const { retrieveEvidenceForDrugs } = require('../services/ragService');

// POST /api/prescriptions/:id/analyse
const analysePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the prescription
    const prescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    if (prescription.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    // Must have extracted drugs first
    if (!prescription.drugs || prescription.drugs.length === 0) {
      return res.status(400).json({
        error: 'No drugs found on this prescription. Please run extraction first.',
        hint: `POST /api/prescriptions/${id}/extract`
      });
    }

    if (prescription.drugs.length < 2) {
      return res.status(400).json({
        error: 'At least 2 drugs are needed to check for interactions.',
        drugsFound: prescription.drugs
      });
    }

    console.log(`\n🔬 Analysing prescription ${id}`);
    console.log(`💊 Drugs: ${prescription.drugs.join(', ')}`);

    // Run RAG — retrieve evidence for all drug pairs
    const ragResults = await retrieveEvidenceForDrugs(prescription.drugs);

    // Update prescription status
    await prisma.prescription.update({
      where: { id },
      data: { status: 'analysed' }
    });

    res.json({
      message: `Analysis complete. Found evidence for ${ragResults.totalEvidenceFound} drug pair(s).`,
      prescriptionId: id,
      drugs: prescription.drugs,
      totalDrugs: prescription.drugs.length,
      totalPairsWithEvidence: ragResults.totalEvidenceFound,
      results: ragResults.pairs.map(pair => ({
        drugPair: `${pair.drugA} + ${pair.drugB}`,
        drugA: pair.drugA,
        drugB: pair.drugB,
        hasExactMatch: pair.hasExactMatch,
        knownSeverity: pair.knownSeverity,
        evidenceCount: pair.evidence.length,
        evidence: pair.evidence.map(e => ({
          type: e.type,
          content: e.content,
          severity: e.severity,
          source: e.source || null,
          confidence: parseFloat((e.confidence || 0).toFixed(3))
        }))
      }))
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyse prescription.' });
  }
};

module.exports = { analysePrescription };