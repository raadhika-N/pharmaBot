PharmaBot – AI-Powered Drug Interaction & Patient Safety Analyzer

PharmaBot is an AI-powered healthcare assistant that analyzes prescriptions and medication lists to identify potential drug-drug interactions, assess risk severity, and generate evidence-backed patient safety reports. By combining medical entity extraction, retrieval-augmented generation (RAG), vector search, and LLM-based reasoning, PharmaBot helps users understand medication risks quickly and efficiently.

Features
Upload prescriptions or enter drug names manually
Automatic drug extraction using AI-powered Named Entity Recognition (NER)
Retrieval of medical evidence from trusted knowledge sources
Detection of drug-drug interactions
Severity classification (Low, Moderate, High)
AI-generated patient safety reports
Evidence-backed recommendations and explanations
OCR support for prescription images (planned)
Explainable AI with source citations (planned)

How It Works
1. Drug Extraction

The system extracts medication names from prescriptions using AI-based entity recognition.

2. Medical Knowledge Retrieval

Relevant medical information and interaction evidence are retrieved from structured medical datasets and vector databases.

3. Interaction Analysis

Potential interactions between medications are identified and analyzed.

4. Risk Classification

Each interaction is categorized by severity and confidence score.

5. Report Generation

A comprehensive patient safety report is generated with detected risks, explanations, and recommendations.

Tech Stack
Backend
Node.js
Express.js
PostgreSQL
Prisma ORM

AI & RAG
OpenAI / Gemini APIs
Embeddings
LangChain
Vector Search
Retrieval-Augmented Generation (RAG)

Database
PostgreSQL
pgvector
Additional Tools

Multer (File Uploads)
Tesseract OCR / Google Vision (Planned)

Architecture
Prescription Upload
        │
        ▼
Drug Extraction (NER)
        │
        ▼
Medical Knowledge Retrieval
        │
        ▼
Vector Search (RAG)
        │
        ▼
Interaction Detection
        │
        ▼
Severity Classification
        │
        ▼
Patient Safety Report

Why PharmaBot?

Most RAG projects focus on document question-answering. PharmaBot goes beyond traditional RAG by implementing a complete healthcare AI workflow:

Medical Entity Extraction
Evidence Retrieval
Risk Classification
Explainable AI
Patient Safety Reporting

This multi-stage pipeline mirrors real-world healthcare decision-support systems and demonstrates practical applications of AI in medicine.

Future Enhancements
OCR-based prescription scanning
Drug dosage validation
Personalized medication recommendations
Multi-language prescription support
Doctor dashboard
PDF report export
Real-time medical database updates
Disclaimer
PharmaBot is intended for educational and research purposes only. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making medical decisions.

Built to improve medication safety through AI-driven healthcare intelligence.
