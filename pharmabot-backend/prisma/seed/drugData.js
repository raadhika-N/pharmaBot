const drugs = [
  {
    name: 'Warfarin',
    genericName: 'Warfarin Sodium',
    drugClass: 'Anticoagulant',
    description: 'Warfarin is a blood thinner used to prevent blood clots.',
    uses: ['Prevention of blood clots', 'Atrial fibrillation', 'Deep vein thrombosis'],
    warnings: ['High bleeding risk', 'Regular INR monitoring required', 'Many drug interactions'],
    sideEffects: ['Bleeding', 'Bruising', 'Nausea']
  },
  {
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    drugClass: 'NSAID / Antiplatelet',
    description: 'Aspirin is used for pain relief and as an antiplatelet agent.',
    uses: ['Pain relief', 'Fever reduction', 'Heart attack prevention'],
    warnings: ['Increases bleeding risk', 'Avoid with other NSAIDs'],
    sideEffects: ['Stomach upset', 'Heartburn', 'Nausea']
  },
  {
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    drugClass: 'NSAID',
    description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug.',
    uses: ['Pain relief', 'Fever reduction', 'Anti-inflammatory'],
    warnings: ['Avoid with anticoagulants', 'Risk of GI bleeding'],
    sideEffects: ['Stomach upset', 'Nausea', 'Dizziness']
  },
  {
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    drugClass: 'Biguanide / Antidiabetic',
    description: 'Metformin is first-line medication for type 2 diabetes.',
    uses: ['Type 2 diabetes', 'Insulin resistance', 'PCOS'],
    warnings: ['Risk of lactic acidosis', 'Avoid in severe kidney disease'],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset']
  },
  {
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    drugClass: 'Statin / Lipid-lowering',
    description: 'Atorvastatin reduces bad cholesterol.',
    uses: ['High cholesterol', 'Heart attack prevention'],
    warnings: ['Risk of myopathy', 'Liver toxicity'],
    sideEffects: ['Muscle pain', 'Liver enzyme elevation', 'Nausea']
  },
  {
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    drugClass: 'Penicillin Antibiotic',
    description: 'Amoxicillin is a penicillin-type antibiotic.',
    uses: ['Bacterial infections', 'Pneumonia', 'Ear infections'],
    warnings: ['Allergy risk in penicillin-sensitive patients'],
    sideEffects: ['Diarrhea', 'Nausea', 'Rash']
  },
  {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    drugClass: 'ACE Inhibitor / Antihypertensive',
    description: 'Lisinopril is an ACE inhibitor for high blood pressure.',
    uses: ['Hypertension', 'Heart failure', 'Diabetic nephropathy'],
    warnings: ['Risk of angioedema', 'Avoid in pregnancy'],
    sideEffects: ['Dry cough', 'Dizziness', 'High potassium']
  },
  {
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    drugClass: 'Proton Pump Inhibitor',
    description: 'Omeprazole reduces stomach acid production.',
    uses: ['GERD', 'Peptic ulcers', 'Acid reflux'],
    warnings: ['Long-term use may cause magnesium deficiency'],
    sideEffects: ['Headache', 'Nausea', 'Diarrhea']
  },
  {
    name: 'Clopidogrel',
    genericName: 'Clopidogrel Bisulfate',
    drugClass: 'Antiplatelet',
    description: 'Clopidogrel prevents blood clots.',
    uses: ['Heart attack prevention', 'Stroke prevention'],
    warnings: ['Bleeding risk', 'Reduced effectiveness with omeprazole'],
    sideEffects: ['Bleeding', 'Bruising', 'Stomach pain']
  },
  {
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    drugClass: 'Analgesic / Antipyretic',
    description: 'Paracetamol is used for pain and fever.',
    uses: ['Pain relief', 'Fever reduction', 'Headache'],
    warnings: ['Liver damage in overdose', 'Avoid with alcohol'],
    sideEffects: ['Liver damage in overdose']
  },
  {
    name: 'Digoxin',
    genericName: 'Digoxin',
    drugClass: 'Cardiac Glycoside',
    description: 'Digoxin strengthens heart contractions.',
    uses: ['Heart failure', 'Atrial fibrillation'],
    warnings: ['Narrow therapeutic index', 'Many drug interactions'],
    sideEffects: ['Nausea', 'Vomiting', 'Visual disturbances']
  },
  {
    name: 'Simvastatin',
    genericName: 'Simvastatin',
    drugClass: 'Statin / Lipid-lowering',
    description: 'Simvastatin lowers cholesterol.',
    uses: ['High cholesterol', 'Cardiovascular disease prevention'],
    warnings: ['Risk of myopathy', 'Avoid grapefruit juice'],
    sideEffects: ['Muscle pain', 'Liver enzyme elevation', 'Headache']
  }
];

const interactions = [
  {
    drugA: 'Warfarin',
    drugB: 'Aspirin',
    severity: 'High',
    description: 'Concurrent use of Warfarin and Aspirin significantly increases the risk of major bleeding events.',
    mechanism: 'Aspirin inhibits platelet aggregation while Warfarin inhibits clotting factor synthesis. Combined effects dramatically increase bleeding risk.',
    evidence: 'Multiple RCTs demonstrate 2-3 fold increase in major bleeding events with combination therapy.',
    source: 'DrugBank / FDA'
  },
  {
    drugA: 'Warfarin',
    drugB: 'Ibuprofen',
    severity: 'High',
    description: 'Ibuprofen increases Warfarin anticoagulant effect and causes gastrointestinal bleeding.',
    mechanism: 'NSAIDs inhibit platelet aggregation and displace Warfarin from plasma protein binding sites.',
    evidence: 'Cohort studies show significantly higher rates of GI bleeding with Warfarin and NSAIDs.',
    source: 'DrugBank / PubMed'
  },
  {
    drugA: 'Aspirin',
    drugB: 'Ibuprofen',
    severity: 'Moderate',
    description: 'Ibuprofen may reduce the cardioprotective antiplatelet effect of low-dose Aspirin.',
    mechanism: 'Ibuprofen competitively inhibits COX-1, blocking Aspirin from irreversibly acetylating its target.',
    evidence: 'FDA has warned that ibuprofen can interfere with antiplatelet activity of low-dose aspirin.',
    source: 'FDA Drug Safety Communication'
  },
  {
    drugA: 'Warfarin',
    drugB: 'Omeprazole',
    severity: 'Moderate',
    description: 'Omeprazole can increase Warfarin plasma levels, raising the risk of bleeding.',
    mechanism: 'Omeprazole inhibits CYP2C19 involved in Warfarin metabolism.',
    evidence: 'Clinical studies show omeprazole increases S-warfarin AUC.',
    source: 'DrugBank'
  },
  {
    drugA: 'Clopidogrel',
    drugB: 'Omeprazole',
    severity: 'Moderate',
    description: 'Omeprazole reduces the antiplatelet effectiveness of Clopidogrel.',
    mechanism: 'Clopidogrel requires CYP2C19 for activation. Omeprazole inhibits CYP2C19 reducing activation by 45%.',
    evidence: 'Multiple studies demonstrate reduced platelet inhibition. FDA has issued warnings.',
    source: 'FDA Drug Safety Communication / DrugBank'
  },
  {
    drugA: 'Lisinopril',
    drugB: 'Ibuprofen',
    severity: 'Moderate',
    description: 'NSAIDs can reduce blood pressure lowering effect of Lisinopril and worsen kidney function.',
    mechanism: 'NSAIDs inhibit prostaglandin synthesis causing sodium retention which antagonises ACE inhibitors.',
    evidence: 'Studies show regular NSAID use reduces antihypertensive efficacy of ACE inhibitors.',
    source: 'DrugBank / PubMed'
  },
  {
    drugA: 'Simvastatin',
    drugB: 'Amoxicillin',
    severity: 'Low',
    description: 'No clinically significant interaction expected between Simvastatin and Amoxicillin.',
    mechanism: 'Amoxicillin does not significantly inhibit CYP3A4 which metabolises Simvastatin.',
    evidence: 'No major interaction reported in literature.',
    source: 'DrugBank'
  },
  {
    drugA: 'Metformin',
    drugB: 'Lisinopril',
    severity: 'Low',
    description: 'Lisinopril may slightly enhance glucose-lowering effect of Metformin.',
    mechanism: 'ACE inhibitors may improve insulin sensitivity enhancing Metformin effect slightly.',
    evidence: 'This combination is commonly used and generally well tolerated.',
    source: 'DrugBank'
  },
  {
    drugA: 'Digoxin',
    drugB: 'Amoxicillin',
    severity: 'Moderate',
    description: 'Amoxicillin may increase Digoxin toxicity by altering gut bacteria.',
    mechanism: 'Gut bacteria normally convert Digoxin to inactive metabolites. Antibiotics kill these bacteria increasing Digoxin absorption.',
    evidence: 'Case reports show increased Digoxin levels with antibiotic use.',
    source: 'DrugBank / PubMed'
  },
  {
    drugA: 'Warfarin',
    drugB: 'Paracetamol',
    severity: 'Moderate',
    description: 'Regular high-dose Paracetamol can increase anticoagulant effect of Warfarin.',
    mechanism: 'Paracetamol metabolites may inhibit vitamin K-dependent clotting factor synthesis.',
    evidence: 'Studies show dose-dependent increase in INR with regular paracetamol in Warfarin patients.',
    source: 'DrugBank / PubMed'
  },
  {
    drugA: 'Atorvastatin',
    drugB: 'Digoxin',
    severity: 'Low',
    description: 'Atorvastatin may slightly increase Digoxin plasma concentration.',
    mechanism: 'Atorvastatin inhibits P-glycoprotein which transports Digoxin out of cells.',
    evidence: 'Studies show approximately 20% increase in Digoxin AUC with Atorvastatin 80mg.',
    source: 'DrugBank'
  },
  {
    drugA: 'Aspirin',
    drugB: 'Clopidogrel',
    severity: 'Moderate',
    description: 'Dual antiplatelet therapy increases bleeding risk compared to either drug alone.',
    mechanism: 'Both drugs inhibit platelet aggregation through different mechanisms — combined use increases bleeding risk.',
    evidence: 'Dual antiplatelet therapy carries 2-3x higher GI bleeding risk.',
    source: 'DrugBank / ACC/AHA Guidelines'
  }
];

module.exports = { drugs, interactions };