# SwasthyaSetu

**SwasthyaSetu** is an advanced, full-stack AI-powered healthcare application. It provides multiple predictive models for disease triage, maternal risk, stroke risk, skin disease classification, drug sentiment analysis, and student mental health prediction.

The platform features a beautiful, dynamic React frontend built with Vite and TailwindCSS, and a robust FastAPI Python backend powered by PyTorch, Scikit-Learn, and LightGBM machine learning models. It is also configured to be compiled into a native Android application using Capacitor.

---

## 🌟 Features

- **Disease Triage**: Input your symptoms to get an immediate prediction of potential conditions using a Random Forest model.
- **Maternal Health Risk**: Assesses patient vitals (Age, Systolic/Diastolic BP, Blood Sugar, Body Temp, Heart Rate) to predict maternal risk levels.
- **Stroke Risk Prediction**: Analyzes patient history and lifestyle factors to predict the likelihood of a stroke.
- **Skin Disease Classification**: Upload an image of a skin lesion. A PyTorch MobileNetV2 computer vision model will classify the image and predict the condition.
- **Drug Sentiment Analysis**: Paste a patient review of a drug to analyze sentiment (Positive/Negative) using NLP and TF-IDF vectorization.
- **Student Mental Health**: Predicts mental health status (Depression, Anxiety, Panic Attacks) based on academic and demographic profiles using a LightGBM model.

---

## 💻 Technology Stack

**Frontend:**
- React (via Vite)
- TailwindCSS (Glassmorphism UI, Dark Mode)
- Axios & Lucide-React
- **Capacitor** (For generating native Android APKs)

**Backend:**
- Python 3.10+
- FastAPI & Uvicorn
- Scikit-Learn, LightGBM, PyTorch (Machine Learning)
- Pandas & NumPy

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Android Studio (Only required if you wish to compile the Android APK locally)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/swasthyasetu.git
cd swasthyasetu
```

### 2. Backend Setup (FastAPI & ML Models)
The backend requires several heavy machine learning libraries.

```bash
# Navigate to the backend directory
cd backend

# Create a Python virtual environment
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install the dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
*The backend API will now be running at `http://localhost:8000`.*

### 3. Frontend Setup (React/Vite)
Open a new terminal window and navigate to the frontend folder.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The web application will now be running at `http://localhost:5173`.*

---

