let embedder = null;

const getEmbedder = async () => {
  if (!embedder) {
    const { pipeline } = await import('@xenova/transformers');
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
};

const generateEmbedding = async (text) => {
  const embed = await getEmbedder();
  const output = await embed(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
};

const buildChunkText = (interaction, drugAName, drugBName) => {
  return `
Drug Interaction: ${drugAName} and ${drugBName}
Severity: ${interaction.severity}
Description: ${interaction.description}
Mechanism: ${interaction.mechanism || ''}
Evidence: ${interaction.evidence || ''}
Source: ${interaction.source}
  `.trim();
};

module.exports = { generateEmbedding, buildChunkText };