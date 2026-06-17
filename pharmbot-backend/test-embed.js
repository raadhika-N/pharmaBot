require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models = [
  'models/text-embedding-004',
  'models/embedding-001',
  'text-embedding-004',
  'embedding-001',
];

async function test() {
  for (const model of models) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: [{ parts: [{ text: 'test embedding' }] }],
      });
      console.log(`✅ ${model} works → ${response.embeddings[0].values.length} dimensions`);
      break;
    } catch (e) {
      console.log(`❌ ${model} failed → ${e.message.slice(0, 60)}`);
    }
  }
}

test();