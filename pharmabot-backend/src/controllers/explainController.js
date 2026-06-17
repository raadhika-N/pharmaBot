const Groq = require('groq-sdk');
const prisma = require('../config/db');
const { retrieveEvidenceForDrugs } = require('../services/ragService');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/prescriptions/:id/explain
// Body: { drugA, drugB }
const explainInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { drugA, drugB } = req.body;

    if (!drugA || !drugB) {
      return res.status(400).json({ error: 'Please provide drugA and drugB to explain.' });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    if (prescription.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    console.log(`\n💡 Explaining: ${drugA} + ${drugB}`);

    // Retrieve evidence specifically for this pair
    const ragResults = await retrieveEvidenceForDrugs([drugA, drugB]);

    if (ragResults.pairs.length === 0) {
      return res.json({
        drugA,
        drugB,
        explanation: `No documented interaction evidence was found between ${drugA} and ${drugB} in our knowledge base. This does not guarantee safety — always consult a pharmacist or physician.`,
        evidenceFound: false
      });
    }

    const pair = ragResults.pairs[0];
    const evidenceText = pair.evidence
      .map(e => e.content)
      .join('\n\n');

    const prompt = `A patient or doctor is asking: "Why is the combination of ${drugA} and ${drugB} flagged as dangerous?"

Evidence available:
${evidenceText}

Explain in simple, clear language (3-4 sentences) suitable for a patient to understand:
1. What happens when these drugs interact
2. Why it's risky
3. What they should do

Be direct and clear. No medical jargon without explanation. Do not return JSON, just plain explanatory text.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are a clinical pharmacist explaining drug interactions to patients in simple, clear language.'
        },
        { role: 'user', content: prompt }
      ]
    });

    const explanation = response.choices[0].message.content;

    res.json({
      drugA,
      drugB,
      explanation,
      evidenceFound: true,
      knownSeverity: pair.knownSeverity,
      sourcesUsed: pair.evidence.length
    });

  } catch (error) {
    console.error('Explain error:', error);

    if (error?.status === 429) {
      return res.status(429).json({ error: 'AI rate limit hit. Please wait a moment and try again.' });
    }

    res.status(500).json({ error: 'Failed to generate explanation.' });
  }
};

module.exports = { explainInteraction };