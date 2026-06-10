# SwasthyaSetu - Project Overview

## Introduction

**SwasthyaSetu** is a unified, multilingual, mobile-first web application designed to democratize healthcare access. Built to directly address the five pillars of the Swasthya initiative, the platform leverages custom Machine Learning models and robust data engineering to provide predictive, accessible, and affordable healthcare tools for marginalized and rural populations.

---

# Core Features & Technical Breakdown

## 1. Rural & Remote Healthcare: Smart Symptom Triage

### Concept
A localized, voice-enabled symptom checker designed for low-literacy users.

### Input
- Text input describing symptoms
- Voice input (converted to text using Web Speech API)
- Age
- Symptom duration

### Custom ML Model
- Natural Language Processing (NLP) Classification Model
- Trained on clinical symptom datasets

### Output
- Triage categorization:
  - 🟢 Green (Low Severity)
  - 🟡 Yellow (Moderate Severity)
  - 🔴 Red (High Severity)
- Immediate first-aid recommendations
- Automated routing to the nearest Primary Health Centre (PHC)

---

## 2. Maternal & Child Health: Pregnancy Risk Predictor

### Concept
A proactive monitoring tool for expectant mothers and ASHA (Accredited Social Health Activist) workers.

### Input
- Blood Pressure
- Blood Sugar
- Gestational Age
- Weight
- Hemoglobin Levels

### Custom ML Model
- Ensemble Learning Model
  - Random Forest
  - XGBoost
- Trained on maternal health risk datasets

### Predicts
- Preeclampsia Risk
- Gestational Diabetes Risk
- Other pregnancy-related complications

### Output
- High Risk / Low Risk classification
- Personalized nutritional recommendations
- Alerts and notifications for healthcare workers

---

## 3. Mental Health for Youth: Sentiment & Mood Tracker

### Concept
A secure and private digital journaling platform that continuously monitors emotional well-being.

### Input
- Daily journal entries
- Interactive chatbot conversations

### Custom ML Model
- Deep Learning Sentiment Analysis Model
  - LSTM Networks
  - Fine-tuned Transformer Models

### Detects
- Depression indicators
- Anxiety patterns
- Acute stress signals

### Output
- Weekly mental health heatmaps
- Personalized coping strategy suggestions
- Emergency helpline recommendations for severe distress

---

## 4. Medicine Availability & Affordability: Generic Med-Match

### Concept
A cost-saving medicine recommendation engine.

### Input
- Prescribed medicine brand name

### Database Engine
- Custom indexed relational database
- Brand-to-salt composition mapping

### Output
- Generic medicine alternatives
- Comparative price analysis
- Estimated savings
- Local medicine availability information

---

## 5. Health Documentation: Mobile Worker DigiVault

### Concept
A portable cloud-based health locker that eliminates dependency on physical medical records.

### Input
- Smartphone images of:
  - Prescriptions
  - Lab reports
  - Vaccination records

### Custom ML Model
#### OCR Pipeline
- Optical Character Recognition for text extraction

#### NER Pipeline
- Named Entity Recognition for medical information extraction

### Extracted Entities
- Doctor Name
- Diagnosis
- Medication List
- Test Results
- Treatment Information

### Output
- Digitized medical records
- Searchable summaries
- Secure cloud storage
- QR-code-based record sharing

---

# 🛠 Technical Stack

## Frontend
- React.js / Next.js
- Tailwind CSS
- Mobile-responsive UI

## Backend
- Python
  - FastAPI
  - Flask

## Database
### Relational Database
- PostgreSQL
  - Medicine matching
  - Structured healthcare data

### NoSQL Database
- MongoDB
  - User logs
  - Medical document storage

## Machine Learning & Data Science
- PyTorch
- Scikit-Learn
- Pandas
- NLTK
- SpaCy

## Language Support
- Google Translate API
- Bhashini API
- Hindi and regional language localization

---

# 🗺 1-Week Execution Roadmap

## Day 1: Architecture, Datasets & Setup

### Tasks
- Finalize and download datasets (Kaggle/WHO)
  - Symptom Checker Dataset
  - Maternal Risk Dataset
  - Mental Health Dataset
- Design mobile-first UI wireframes in Figma
- Create GitHub repository
- Configure CI/CD pipelines
- Initialize:
  - React Frontend
  - FastAPI Backend

---

## Day 2: Data Preprocessing & Database Schema

### Tasks
- Clean and preprocess datasets
  - Handle missing values
  - Normalize features
  - Standardize formats

### Database Design
- Users
- Medical Records
- Medicine Mapping Database

### Frontend Development
- Routing setup
- Navbar
- Footer
- Five feature pages

---

## Day 3: Core Machine Learning Development (Part 1)

### Tasks
#### Maternal Risk Predictor
- Train model
- Validate performance

#### Symptom Triage Model
- Train NLP classifier
- Evaluate accuracy

#### Deployment Preparation
- Export models
  - `.pkl`
  - `.onnx`

#### Backend APIs
- Build inference endpoints
- Connect model serving pipeline

---

## Day 4: Core Machine Learning Development (Part 2)

### Tasks

#### Mental Health Model
- Train sentiment analysis model
- Evaluate performance

#### DigiVault Development
- Build OCR pipeline
- Develop NER extraction system

#### Medicine Database
- Populate initial brand-to-salt mappings
- Optimize indexing

---

## Day 5: Frontend Integration & Accessibility

### Tasks
- Connect React frontend with FastAPI backend
- Implement API communication using:
  - Axios
  - Fetch API

### State Management
- Redux
- Context API

### Accessibility Features
- Language toggle support
- Voice-based symptom input using Web Speech API

---

## Day 6: System Testing & Edge Case Handling

### Tasks
- End-to-end testing across all five modules

### Edge Case Management
- Prediction loading indicators
- OCR error handling for blurry images
- Fallback responses for unsupported symptom descriptions

### Performance Optimization
- Database query caching
- Faster model inference

---

## Day 7: Deployment & Presentation Polish

### Deployment

#### Frontend
- Vercel
- Netlify

#### Backend & Database
- Render
- Railway
- AWS

### Demo Preparation
- Record a 2–3 minute walkthrough
- Showcase all five healthcare modules

### Final Pitch Deck
Focus on how the platform solves:

- 📍 Distance barriers
- 💰 Healthcare affordability challenges
- 🌐 Language accessibility issues

while delivering predictive, inclusive, and scalable healthcare services to underserved communities.

---

# Expected Impact

SwasthyaSetu combines Artificial Intelligence, Natural Language Processing, OCR, Healthcare Analytics, and Multilingual Accessibility into a single platform that empowers rural communities with:

- Early disease detection
- Maternal health monitoring
- Mental health support
- Affordable medicine discovery
- Secure digital health records

ultimately improving healthcare accessibility, affordability, and continuity of care across underserved populations.