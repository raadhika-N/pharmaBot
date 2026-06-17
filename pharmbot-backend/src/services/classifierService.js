const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const classifyInteraction = async (drugA, drugB, evidence) => {
  // Build evidence text from retrieved chunks
  const evidenceText = evidence
    .map((e, i) => `Evidence ${i + 1} (${e.type}, confidence: ${e.confidence}):\n${e.content}`)
    .join('\n\n');

  const prompt = `You are a clinical pharmacology AI assistant. Your job is to classify drug interactions based on provided medical evidence.

Drugs being assessed: ${drugA} + ${drugB}

Retrieved Medical Evidence:
${evidenceText}

Based ONLY on the evidence provided above, classify this drug interaction.

Return ONLY a valid JSON object with no explanation, no markdown, no extra text:
{
  "severity": "High" or "Moderate" or "Low" or "None",
  "confidence": number between 0 and 1,
  "reason": "brief medical explanation in 1-2 sentences",
  "mechanism": "how the interaction occurs mechanistically",
  "recommendation": "clinical recommendation for healthcare provider",
  "evidenceBased": true or false
}

Rules:
- severity "High" = avoid combination or requires immediate medical supervision
- severity "Moderate" = use with caution, monitor patient
- severity "Low" = minimal clinical significance, routine monitoring
- severity "None" = no significant interaction found in evidence
- evidenceBased must be true if you used the provided evidence, false if guessing`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: 'You are a clinical pharmacology AI. Always respond with valid JSON only. No markdown, no explanation, just the JSON object.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const content = response.choices[0].message.content;

  // Clean up any markdown the model might add
  const cleaned = content.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  // Validate required fields
  const validSeverities = ['High', 'Moderate', 'Low', 'None'];
  if (!validSeverities.includes(parsed.severity)) {
    parsed.severity = 'Low';
  }

  if (typeof parsed.confidence !== 'number') {
    parsed.confidence = 0.5;
  }

  parsed.confidence = Math.min(1, Math.max(0, parsed.confidence));

  return {
    drugA,
    drugB,
    severity: parsed.severity,
    confidence: parseFloat(parsed.confidence.toFixed(3)),
    reason: parsed.reason || 'No reason provided',
    mechanism: parsed.mechanism || 'Mechanism unknown',
    recommendation: parsed.recommendation || 'Consult healthcare provider',
    evidenceBased: parsed.evidenceBased === true
  };
};

// Classify all drug pairs from RAG results
const classifyAllInteractions = async (ragResults) => {
  const classifications = [];

  for (const pair of ragResults.pairs) {
    console.log(`   🤖 Classifying: ${pair.drugA} + ${pair.drugB}...`);

    try {
      const classification = await classifyInteraction(
        pair.drugA,
        pair.drugB,
        pair.evidence
      );

      classifications.push({
        ...classification,
        hasExactMatch: pair.hasExactMatch,
        knownSeverity: pair.knownSeverity
      });

      // Small delay between Groq calls
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`Classification failed for ${pair.drugA} + ${pair.drugB}:`, error.message);

      // If classification fails, fall back to known severity from DB
      classifications.push({
        drugA: pair.drugA,
        drugB: pair.drugB,
        severity: pair.knownSeverity || 'Unknown',
        confidence: pair.hasExactMatch ? 0.9 : 0.3,
        reason: 'Classification failed — using database record',
        mechanism: 'See medical literature',
        recommendation: 'Consult healthcare provider',
        evidenceBased: pair.hasExactMatch,
        hasExactMatch: pair.hasExactMatch,
        knownSeverity: pair.knownSeverity,
        error: true
      });
    }
  }

  // Sort by severity
  const severityOrder = { High: 0, Moderate: 1, Low: 2, None: 3, Unknown: 4 };
  classifications.sort((a, b) =>
    (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5)
  );

  return classifications;
};

module.exports = { classifyInteraction, classifyAllInteractions };