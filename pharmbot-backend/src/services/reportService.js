const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateNarrative = async (drugs, classifications, summary) => {
  const classificationsText = classifications.map(c =>
    `${c.drugA} + ${c.drugB}: ${c.severity} risk — ${c.reason} Recommendation: ${c.recommendation}`
  ).join('\n');

  const prompt = `You are a clinical pharmacist writing a patient safety report.

Patient is taking these medications: ${drugs.join(', ')}

Drug Interaction Analysis:
${classificationsText}

Overall Summary:
- Total interactions found: ${summary.total}
- High risk: ${summary.high}
- Moderate risk: ${summary.moderate}
- Low risk: ${summary.low}

Write a professional, clear patient safety narrative report. Include:
1. A brief introduction about the patient's medication list
2. Key safety concerns (focus on High risk first)
3. Moderate risk interactions to monitor
4. Overall safety assessment
5. Important notes for the prescribing physician

Keep it professional but readable. 3-5 paragraphs. No markdown headers, just plain paragraphs.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: 'You are a clinical pharmacist writing professional patient safety reports. Be clear, accurate, and professional.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return response.choices[0].message.content;
};

const generateActionItems = (classifications, summary) => {
  const actions = [];

  // High risk actions
  const highRisk = classifications.filter(c => c.severity === 'High');
  highRisk.forEach(c => {
    actions.push({
      priority: 'URGENT',
      action: `Review ${c.drugA} + ${c.drugB} combination immediately`,
      reason: c.reason,
      recommendation: c.recommendation
    });
  });

  // Moderate risk actions
  const moderateRisk = classifications.filter(c => c.severity === 'Moderate');
  moderateRisk.forEach(c => {
    actions.push({
      priority: 'MONITOR',
      action: `Monitor patient on ${c.drugA} + ${c.drugB}`,
      reason: c.reason,
      recommendation: c.recommendation
    });
  });

  // General actions
  if (summary.high > 0) {
    actions.push({
      priority: 'URGENT',
      action: 'Schedule immediate medication review with prescribing physician',
      reason: `${summary.high} high-risk interaction(s) detected`,
      recommendation: 'Do not adjust medications without medical supervision'
    });
  }

  if (summary.total > 0) {
    actions.push({
      priority: 'ROUTINE',
      action: 'Document interaction review in patient medical record',
      reason: 'Medication safety documentation required',
      recommendation: 'Keep record of all identified interactions'
    });
  }

  return actions;
};

const determineOverallRisk = (summary) => {
  if (summary.high > 0) return 'HIGH';
  if (summary.moderate > 0) return 'MODERATE';
  if (summary.low > 0) return 'LOW';
  return 'MINIMAL';
};

module.exports = { generateNarrative, generateActionItems, determineOverallRisk };