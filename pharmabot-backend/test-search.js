require('dotenv').config();
const { searchKnowledge, searchDrugInteractions } = require('./src/services/vectorSearchService');

async function test() {
  console.log('🔍 Testing vector search...\n');

  console.log('Test 1: Searching for "blood thinner bleeding risk"');
  const results1 = await searchKnowledge('blood thinner bleeding risk', 3);
  results1.forEach(r => {
    console.log(`  ✅ [${r.similarity.toFixed(3)}] ${JSON.stringify(r.drugNames)} - ${r.severity}`);
  });

  console.log('\nTest 2: Searching for "anticoagulant platelet"');
  const results2 = await searchKnowledge('anticoagulant platelet inhibition', 3);
  results2.forEach(r => {
    console.log(`  ✅ [${r.similarity.toFixed(3)}] ${JSON.stringify(r.drugNames)} - ${r.severity}`);
  });

  console.log('\nTest 3: Drug pair search for Warfarin + Aspirin + Ibuprofen');
  const results3 = await searchDrugInteractions(['Warfarin', 'Aspirin', 'Ibuprofen']);
  results3.forEach(r => {
    console.log(`  ✅ ${r.drugPair.join(' + ')} → ${r.evidence.length} evidence chunks found`);
  });
}

test()
  .catch(console.error)
  .finally(() => process.exit(0));