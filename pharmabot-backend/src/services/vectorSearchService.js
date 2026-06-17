const prisma = require('../config/db');
const { generateEmbedding } = require('./embeddingService');

// Cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const searchKnowledge = async (queryText, limit = 5) => {
  // Convert query to embedding
  const queryEmbedding = await generateEmbedding(queryText);

  // Fetch all chunks from DB
  const chunks = await prisma.knowledgeChunk.findMany({
    where: { embedding: { not: null } }
  });

  // Calculate similarity for each chunk in JavaScript
  const scored = chunks.map(chunk => {
    const chunkEmbedding = chunk.embedding;
    const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
    return { ...chunk, similarity };
  });

  // Sort by similarity and return top results
  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
};

const searchDrugInteractions = async (drugNames) => {
  const results = [];

  for (let i = 0; i < drugNames.length; i++) {
    for (let j = i + 1; j < drugNames.length; j++) {
      const drugA = drugNames[i];
      const drugB = drugNames[j];

      const query = `Drug interaction between ${drugA} and ${drugB} side effects warnings severity`;
      const searchResults = await searchKnowledge(query, 3);

      const relevant = searchResults.filter(r => {
        const names = Array.isArray(r.drugNames) ? r.drugNames : JSON.parse(r.drugNames || '[]');
        const hasA = names.some(n =>
          n.toLowerCase().includes(drugA.toLowerCase()) ||
          drugA.toLowerCase().includes(n.toLowerCase())
        );
        const hasB = names.some(n =>
          n.toLowerCase().includes(drugB.toLowerCase()) ||
          drugB.toLowerCase().includes(n.toLowerCase())
        );
        return hasA || hasB || r.similarity > 0.7;
      });

      if (relevant.length > 0) {
        results.push({
          drugPair: [drugA, drugB],
          evidence: relevant
        });
      }
    }
  }

  return results;
};

module.exports = { searchKnowledge, searchDrugInteractions };