require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash-lite',
];

async function test() {
  console.log('Key loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'NO');
  
  for (const modelName of models) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: 'Say OK'
      });
      console.log(`✅ ${modelName} works → ${response.text.trim()}`);
      break;
    } catch (e) {
      console.log(`❌ ${modelName} failed → ${e.message.slice(0, 80)}`);
    }
  }
}

test();