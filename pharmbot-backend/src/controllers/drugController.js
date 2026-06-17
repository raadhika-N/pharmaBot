const prisma = require('../config/db');

// GET /api/drugs
const getAllDrugs = async (req, res) => {
  try {
    const drugs = await prisma.drug.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        genericName: true,
        drugClass: true,
        description: true,
        uses: true,
        warnings: true,
        sideEffects: true
      }
    });

    res.json({ count: drugs.length, drugs });
  } catch (error) {
    console.error('Get drugs error:', error);
    res.status(500).json({ error: 'Failed to fetch drugs.' });
  }
};

// GET /api/drugs/:name
const getDrugByName = async (req, res) => {
  try {
    const { name } = req.params;

    const drug = await prisma.drug.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

    if (!drug) {
      return res.status(404).json({ error: `Drug "${name}" not found in knowledge base.` });
    }

    // Also fetch all interactions for this drug
    const interactions = await prisma.drugInteraction.findMany({
      where: {
        OR: [
          { drugAId: drug.id },
          { drugBId: drug.id }
        ]
      },
      include: {
        drugA: { select: { name: true } },
        drugB: { select: { name: true } }
      }
    });

    res.json({ drug, interactions });
  } catch (error) {
    console.error('Get drug error:', error);
    res.status(500).json({ error: 'Failed to fetch drug.' });
  }
};

// POST /api/drugs/check-interactions
// Takes a list of drug names and returns all known interactions between them
const checkInteractions = async (req, res) => {
  try {
    const { drugs } = req.body;

    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
      return res.status(400).json({
        error: 'Please provide at least 2 drug names in the drugs array.'
      });
    }

    // Find all these drugs in the DB (case insensitive)
    const foundDrugs = await prisma.drug.findMany({
      where: {
        name: {
          in: drugs,
          mode: 'insensitive'
        }
      }
    });

    const foundNames = foundDrugs.map(d => d.name);
    const notFound = drugs.filter(
      d => !foundNames.some(f => f.toLowerCase() === d.toLowerCase())
    );

    const drugIds = foundDrugs.map(d => d.id);

    // Find all interactions between any pair of these drugs
    const interactions = await prisma.drugInteraction.findMany({
      where: {
        AND: [
          { drugAId: { in: drugIds } },
          { drugBId: { in: drugIds } }
        ]
      },
      include: {
        drugA: { select: { name: true, drugClass: true } },
        drugB: { select: { name: true, drugClass: true } }
      },
      orderBy: [
        { severity: 'asc' }
      ]
    });

    // Sort by severity manually (High first)
    const severityOrder = { High: 0, Moderate: 1, Low: 2 };
    const sorted = interactions.sort(
      (a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
    );

    res.json({
      drugsChecked: foundNames,
      drugsNotInDatabase: notFound,
      interactionsFound: sorted.length,
      interactions: sorted
    });

  } catch (error) {
    console.error('Check interactions error:', error);
    res.status(500).json({ error: 'Failed to check interactions.' });
  }
};

module.exports = { getAllDrugs, getDrugByName, checkInteractions };