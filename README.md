# PharmaBot

### AI-Powered Drug Interaction & Patient Safety Analyzer

PharmaBot is an AI-powered healthcare assistant that analyzes prescriptions and medication lists to identify potential drug-drug interactions, assess risk severity, and generate evidence-backed patient safety reports.

By combining Medical Entity Recognition (NER), Retrieval-Augmented Generation (RAG), Vector Search, and LLM-based reasoning, PharmaBot helps users understand medication risks quickly and efficiently.

---

## Overview

Managing multiple medications can be challenging, as certain drugs may interact with each other and lead to adverse effects. PharmaBot automates the process of identifying these interactions by extracting medications from prescriptions, retrieving relevant medical evidence, analyzing risks, and generating structured safety reports.

---

## Features

* Upload prescriptions or enter medication names manually
* AI-powered drug extraction using Named Entity Recognition (NER)
* Retrieval of medical evidence from trusted medical sources
* Detection of potential drug-drug interactions
* Severity classification (Low, Moderate, High)
* Confidence scoring for detected interactions
* AI-generated patient safety reports
* Evidence-backed explanations and recommendations
* Explainable AI workflow with supporting references
* OCR support for prescription images (Planned)

---

## Architecture

```text
Prescription Upload
        |
        v
Drug Extraction (NER)
        |
        v
Medical Knowledge Retrieval
        |
        v
Vector Search (RAG)
        |
        v
Interaction Detection
        |
        v
Severity Classification
        |
        v
Patient Safety Report
```

---

## How It Works

### 1. Drug Extraction

The system extracts medication names from prescriptions using AI-powered entity recognition.

### 2. Medical Knowledge Retrieval

Relevant medical information and interaction evidence are retrieved from structured medical databases and vector search systems.

### 3. Interaction Analysis

Potential interactions between medications are identified using retrieved evidence and LLM-based reasoning.

### 4. Risk Classification

Each interaction is categorized by severity and assigned a confidence score.

### 5. Report Generation

A comprehensive patient safety report is generated with detected risks, explanations, and recommendations.

---

## Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM

### AI & RAG

* OpenAI / Gemini APIs
* LangChain
* Embeddings
* Vector Search
* Retrieval-Augmented Generation (RAG)

### Database

* PostgreSQL
* pgvector

### Additional Tools

* Multer
* Tesseract OCR (Planned)
* Google Vision API (Planned)

---

## Example Output

```json
{
  "detected_drugs": [
    "Warfarin",
    "Aspirin"
  ],
  "interaction": {
    "severity": "High",
    "confidence": 0.91,
    "reason": "Increased bleeding risk"
  }
}
```

---

## Why PharmaBot?

Most RAG projects focus on answering questions from uploaded documents. PharmaBot goes beyond traditional document retrieval by implementing a complete healthcare AI workflow.

Key capabilities include:

* Medical Entity Extraction
* Evidence Retrieval
* Interaction Detection
* Risk Classification
* Explainable AI
* Patient Safety Reporting

This multi-stage pipeline closely resembles real-world clinical decision-support systems and demonstrates practical applications of AI in healthcare.

---

## Future Enhancements

* OCR-based prescription scanning
* Drug dosage validation
* Multi-language prescription support
* Personalized medication recommendations
* Doctor dashboard
* PDF report generation
* Real-time medical database updates

---

## Disclaimer

PharmaBot is intended for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making healthcare decisions.

---

Built to improve medication safety through AI-powered healthcare intelligence.

