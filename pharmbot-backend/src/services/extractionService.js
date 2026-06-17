const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const extractDrugsFromText = async (text) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a medical AI assistant. Extract ONLY drug/medication names from prescription text. Ignore dosages, frequencies, instructions. Return ONLY valid JSON: {"drugs": ["DrugName1", "DrugName2"]}`
      },
      {
        role: 'user',
        content: `Extract all drug names from: "${text}"`
      }
    ]
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);

  if (!parsed.drugs || !Array.isArray(parsed.drugs)) return [];

  return parsed.drugs.map(d => d.trim()).filter(d => d.length > 0);
};

module.exports = { extractDrugsFromText };