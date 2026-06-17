require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { drugs, interactions } = require('./drugData');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('🗑️  Clearing existing drug data...');
  await prisma.drugInteraction.deleteMany({});
  await prisma.drug.deleteMany({});

  console.log('💊 Seeding drugs...');
  for (const drug of drugs) {
    await prisma.drug.create({
      data: drug
    });
    console.log(`   ✅ ${drug.name}`);
  }

  console.log('⚡ Seeding interactions...');
  for (const interaction of interactions) {
    const drugA = await prisma.drug.findUnique({
      where: { name: interaction.drugA }
    });
    const drugB = await prisma.drug.findUnique({
      where: { name: interaction.drugB }
    });

    if (!drugA || !drugB) {
      console.log(`   ⚠️  Skipping: ${interaction.drugA} + ${interaction.drugB} (drug not found)`);
      continue;
    }

    await prisma.drugInteraction.create({
      data: {
        drugAId: drugA.id,
        drugBId: drugB.id,
        severity: interaction.severity,
        description: interaction.description,
        mechanism: interaction.mechanism,
        evidence: interaction.evidence,
        source: interaction.source
      }
    });
    console.log(`   ✅ ${interaction.drugA} + ${interaction.drugB} → ${interaction.severity}`);
  }

  const drugCount = await prisma.drug.count();
  const interactionCount = await prisma.drugInteraction.count();

  console.log('\n✨ Seed complete!');
  console.log(`   💊 ${drugCount} drugs`);
  console.log(`   ⚡ ${interactionCount} interactions`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });