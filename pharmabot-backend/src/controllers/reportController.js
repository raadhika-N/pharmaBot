const prisma = require('../config/db');
const { retrieveEvidenceForDrugs } = require('../services/ragService');
const { classifyAllInteractions } = require('../services/classifierService');
const {
  generateNarrative,
  generateActionItems,
  determineOverallRisk
} = require('../services/reportService');

// POST /api/prescriptions/:id/report
const generateReport = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { report: true }
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
        error: 'At least 2 drugs needed to generate a report.',
        drugsFound: prescription.drugs
      });
    }

    // If report already exists, return it
    if (prescription.report) {
      return res.json({
        message: 'Report already generated.',
        report: prescription.report,
        cached: true
      });
    }

    console.log(`\n📋 Generating report for prescription ${id}`);
    console.log(`💊 Drugs: ${prescription.drugs.join(', ')}`);

    // Step 1 — RAG: retrieve evidence
    console.log('📚 Step 1: Retrieving evidence...');
    const ragResults = await retrieveEvidenceForDrugs(prescription.drugs);

    // Step 2 — Classify all interactions
    console.log('🤖 Step 2: Classifying interactions...');
    const classifications = ragResults.pairs.length > 0
      ? await classifyAllInteractions(ragResults)
      : [];

    // Step 3 — Build summary
    const summary = {
      total: classifications.length,
      high: classifications.filter(c => c.severity === 'High').length,
      moderate: classifications.filter(c => c.severity === 'Moderate').length,
      low: classifications.filter(c => c.severity === 'Low').length,
      none: classifications.filter(c => c.severity === 'None').length
    };

    // Step 4 — Generate narrative
    console.log('✍️  Step 3: Generating narrative...');
    const narrative = classifications.length > 0
      ? await generateNarrative(prescription.drugs, classifications, summary)
      : `Patient safety review completed for ${prescription.drugs.join(', ')}. No significant drug interactions were identified in our knowledge base for this medication combination. Standard monitoring is recommended.`;

    // Step 5 — Generate action items
    const actionItems = generateActionItems(classifications, summary);

    // Step 6 — Determine overall risk
    const overallRisk = determineOverallRisk(summary);

    // Step 7 — Save report to DB
    const report = await prisma.report.create({
      data: {
        prescriptionId: id,
        userId: req.user.id,
        drugs: prescription.drugs,
        classifications,
        summary,
        narrative,
        overallRisk,
        actionItems
      }
    });

    // Step 8 — Update prescription status
    await prisma.prescription.update({
      where: { id },
      data: { status: 'reported' }
    });

    console.log(`✅ Report generated successfully. Overall risk: ${overallRisk}`);

    res.status(201).json({
      message: 'Patient safety report generated successfully.',
      report: {
        id: report.id,
        prescriptionId: report.prescriptionId,
        generatedAt: report.generatedAt,
        drugs: report.drugs,
        overallRisk: report.overallRisk,
        summary: report.summary,
        classifications: report.classifications,
        narrative: report.narrative,
        actionItems: report.actionItems
      }
    });

  } catch (error) {
    console.error('Report generation error:', error);

    if (error?.status === 429) {
      return res.status(429).json({
        error: 'AI rate limit hit. Please wait a moment and try again.'
      });
    }

    res.status(500).json({ error: 'Failed to generate report.' });
  }
};

// GET /api/prescriptions/:id/report
const getReport = async (req, res) => {
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

    const report = await prisma.report.findUnique({
      where: { prescriptionId: id }
    });

    if (!report) {
      return res.status(404).json({
        error: 'No report found for this prescription.',
        hint: `POST /api/prescriptions/${id}/report`
      });
    }

    res.json({ report });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to fetch report.' });
  }
};

// GET /api/reports
const getAllReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      where: { userId: req.user.id },
      orderBy: { generatedAt: 'desc' },
      select: {
        id: true,
        prescriptionId: true,
        drugs: true,
        overallRisk: true,
        summary: true,
        generatedAt: true
      }
    });

    res.json({
      count: reports.length,
      reports
    });

  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
};

module.exports = { generateReport, getReport, getAllReports };