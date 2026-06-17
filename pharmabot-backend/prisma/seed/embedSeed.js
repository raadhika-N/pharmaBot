require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { generateEmbedding, buildChunkText } = require('../../src/services/embeddingService');

const prisma = new PrismaClient();

async function main() {
  console.log('🔢 Starting embedding seed...');

  console.log('🗑️  Clearing existing knowledge chunks...');
  await prisma.knowledgeChunk.deleteMany({});

  const interactions = await prisma.drugInteraction.findMany({
    include: {
      drugA: { select: { name: true } },
      drugB: { select: { name: true } }
    }
  });

  console.log(`📚 Found ${interactions.length} interactions to embed...`);

  for (const interaction of interactions) {
    const drugAName = interaction.drugA.name;
    const drugBName = interaction.drugB.name;

    const content = buildChunkText(interaction, drugAName, drugBName);

    console.log(`   🔄 Embedding: ${drugAName} + ${drugBName}...`);

    const embedding = await generateEmbedding(content);

    // Store as regular Prisma create — no raw SQL, no vector type
    await prisma.knowledgeChunk.create({
      data: {
        content,
        chunkType: 'interaction',
        drugNames: [drugAName, drugBName],
        severity: interaction.severity,
        interactionId: interaction.id,
        embedding: embedding
      }
    });

    console.log(`   ✅ ${drugAName} + ${drugBName} embedded (${embedding.length} dimensions)`);
  }

  const count = await prisma.knowledgeChunk.count();
  console.log(`\n✨ Embedding complete! ${count} chunks stored.`);
}

main()
  .catch((e) => {
    console.error('❌ Embedding seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });