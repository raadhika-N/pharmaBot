const { searchDrugInteractions, searchKnowledge } = require('./vectorSearchService');
const prisma = require('../config/db');

const retrieveEvidenceForDrugs = async (drugNames) => {
  if (!drugNames || drugNames.length < 2) {
    return {
      drugNames,
      pairs: [],
      totalEvidenceFound: 0
    };
  }

  console.log(`🔍 RAG: Searching evidence for drugs: ${drugNames.join(', ')}`);

  // Step 1 — Also check exact DB matches for known interactions
  const exactMatches = await getExactInteractions(drugNames);

  // Step 2 — Semantic search for each drug pair
  const semanticResults = await searchDrugInteractions(drugNames);

  // Step 3 — Merge exact matches with semantic results
  const pairs = [];

  for (let i = 0; i < drugNames.length; i++) {
    for (let j = i + 1; j < drugNames.length; j++) {
      const drugA = drugNames[i];
      const drugB = drugNames[j];

      // Check exact match first
      const exactMatch = exactMatches.find(m =>
        (m.drugA.name.toLowerCase() === drugA.toLowerCase() &&
         m.drugB.name.toLowerCase() === drugB.toLowerCase()) ||
        (m.drugA.name.toLowerCase() === drugB.toLowerCase() &&
         m.drugB.name.toLowerCase() === drugA.toLowerCase())
      );

      // Get semantic evidence for this pair
      const semanticMatch = semanticResults.find(r =>
        r.drugPair.some(d => d.toLowerCase() === drugA.toLowerCase()) &&
        r.drugPair.some(d => d.toLowerCase() === drugB.toLowerCase())
      );

      const evidence = [];

      // Add exact DB match as primary evidence
      if (exactMatch) {
        evidence.push({
          type: 'exact_match',
          content: exactMatch.description,
          mechanism: exactMatch.mechanism,
          severity: exactMatch.severity,
          source: exactMatch.source,
          confidence: 1.0
        });
      }

      // Add semantic evidence
      if (semanticMatch && semanticMatch.evidence.length > 0) {
        semanticMatch.evidence.forEach(e => {
          evidence.push({
            type: 'semantic_match',
            content: e.content,
            severity: e.severity,
            similarity: e.similarity,
            confidence: e.similarity
          });
        });
      }

      if (evidence.length > 0) {
        pairs.push({
          drugA,
          drugB,
          evidence,
          hasExactMatch: !!exactMatch,
          knownSeverity: exactMatch?.severity || null
        });
      }
    }
  }

  return {
    drugNames,
    pairs,
    totalEvidenceFound: pairs.length
  };
};

// Get exact interactions from DB for known drug pairs
const getExactInteractions = async (drugNames) => {
  const drugs = await prisma.drug.findMany({
    where: {
      name: {
        in: drugNames,
        mode: 'insensitive'
      }
    }
  });

  const drugIds = drugs.map(d => d.id);

  const interactions = await prisma.drugInteraction.findMany({
    where: {
      AND: [
        { drugAId: { in: drugIds } },
        { drugBId: { in: drugIds } }
      ]
    },
    include: {
      drugA: { select: { name: true } },
      drugB: { select: { name: true } }
    }
  });

  return interactions;
};

module.exports = { retrieveEvidenceForDrugs };