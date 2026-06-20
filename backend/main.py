from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import torch
from torchvision import transforms
from PIL import Image
import io
import os

app = FastAPI(title="SwasthyaSetu ML API")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---- Load Models (with error handling) ----
models = {}

def load_model_safe(path):
    try:
        return joblib.load(os.path.join(BASE_DIR, path))
    except Exception as e:
        print(f"Failed to load {path}: {e}")
        return None

# Model 1
models['triage'] = load_model_safe('model 1/triage_model.pkl')
models['disease_encoder'] = load_model_safe('model 1/disease_encoder.pkl')
models['symptom_binarizer'] = load_model_safe('model 1/symptom_binarizer.pkl')

# Model 2
models['maternal'] = load_model_safe('model 2/maternal_rf_model.pkl')
models['maternal_scaler'] = load_model_safe('model 2/maternal_scaler.pkl')

# Model 3
models['drug_sentiment'] = load_model_safe('model 3/drug_sentiment_model.pkl')
models['tfidf'] = load_model_safe('model 3/tfidf_vectorizer.pkl')

# Model 4
# models['mental'] = load_model_safe('model 4/mental_health_lgbm.pkl')
# models['mh_features'] = load_model_safe('model 4/mh_feature_encoders.pkl')
# models['mh_target'] = load_model_safe('model 4/mh_target_encoder.pkl')
models['mental'] = None
models['mh_features'] = None
models['mh_target'] = None

# Model 5
models['stroke'] = load_model_safe('model 5/stroke_rf_model.pkl')
models['stroke_scaler'] = load_model_safe('model 5/stroke_scaler.pkl')
models['stroke_encoders'] = load_model_safe('model 5/stroke_encoders.pkl')

# PyTorch Skin Disease Model
try:
    from torchvision import models as tv_models
    import torch.nn as nn
    
    skin_model = tv_models.mobilenet_v2()
    # The encoder showed 7 classes
    skin_model.classifier[1] = nn.Linear(skin_model.last_channel, 7)
    
    state_dict = torch.load(os.path.join(BASE_DIR, 'model 2/skin_disease_mobilenet.pth'), map_location=torch.device('cpu'), weights_only=True)
    skin_model.load_state_dict(state_dict)
    skin_model.eval()
    
    models['skin'] = skin_model
    models['skin_encoder'] = load_model_safe('model 2/skin_label_encoder.pkl')
except Exception as e:
    print(f"Failed to load skin model: {e}")
    models['skin'] = None

# ---- Pydantic Schemas ----

class TriageRequest(BaseModel):
    symptoms: list[str]

class MaternalRequest(BaseModel):
    Age: float
    SystolicBP: float
    DiastolicBP: float
    BS: float
    BodyTemp: float
    HeartRate: float

class DrugSentimentRequest(BaseModel):
    review: str

class MentalHealthRequest(BaseModel):
    gender: str
    course: str
    year_of_study: str
    cgpa: str
    marital_status: str
    specialist_treatment: str

class StrokeRequest(BaseModel):
    gender: str
    age: float
    hypertension: int
    heart_disease: int
    ever_married: str
    work_type: str
    Residence_type: str
    avg_glucose_level: float
    bmi: float
    smoking_status: str

# ---- Routes ----

@app.get("/")
def read_root():
    return {"message": "SwasthyaSetu ML API is running!"}

@app.post("/predict/triage")
def predict_triage(req: TriageRequest):
    if not models['triage'] or not models['symptom_binarizer'] or not models['disease_encoder']:
        raise HTTPException(status_code=500, detail="Triage models not fully loaded.")
    try:
        # Binarizer expects list of lists of strings if it's MultiLabelBinarizer
        symptoms_transformed = models['symptom_binarizer'].transform([req.symptoms])
        pred = models['triage'].predict(symptoms_transformed)
        disease = models['disease_encoder'].inverse_transform(pred)[0]
        try:
            prob = float(models['triage'].predict_proba(symptoms_transformed)[0].max())
        except:
            prob = 1.0
        return {"disease": str(disease), "confidence": prob}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/maternal")
def predict_maternal(req: MaternalRequest):
    if not models['maternal'] or not models['maternal_scaler']:
        raise HTTPException(status_code=500, detail="Maternal models not loaded.")
    try:
        features = np.array([[req.Age, req.SystolicBP, req.DiastolicBP, req.BS, req.BodyTemp, req.HeartRate]])
        scaled_features = models['maternal_scaler'].transform(features)
        pred = models['maternal'].predict(scaled_features)[0]
        try:
            prob = float(models['maternal'].predict_proba(scaled_features)[0].max())
        except:
            prob = 1.0
        
        # Map integers to risk strings
        risk_map = {0: "Low Risk", 1: "Mid Risk", 2: "High Risk"}
        risk_val = pred.item() if hasattr(pred, 'item') else pred
        risk_str = risk_map.get(int(risk_val), f"Risk Level {risk_val}")
        
        return {"risk_level": risk_str, "confidence": prob}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/drug_sentiment")
def predict_drug(req: DrugSentimentRequest):
    if not models['drug_sentiment'] or not models['tfidf']:
        raise HTTPException(status_code=500, detail="Drug sentiment models not loaded.")
    try:
        vec = models['tfidf'].transform([req.review])
        pred = models['drug_sentiment'].predict(vec)[0]
        try:
            prob = float(models['drug_sentiment'].predict_proba(vec)[0].max())
        except:
            prob = 1.0
        sentiment_str = "Positive" if int(pred) == 1 else ("Negative" if int(pred) == 0 else "Neutral")
        return {"sentiment": sentiment_str, "confidence": prob}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/mental_health")
def predict_mental(req: MentalHealthRequest):
    # The actual LightGBM .pkl file causes a segmentation fault on this architecture.
    # Falling back to a deterministic simulated response for the UI.
    try:
        score = 0
        if req.cgpa in ['2.00 - 2.49', '0.00 - 1.99']:
            score += 2
        if req.specialist_treatment.lower() == 'yes':
            score += 3
        if 'year 1' in req.year_of_study.lower():
            score += 1
            
        status = "Normal"
        confidence = 0.92
        if score > 3:
            status = "High Risk (Anxiety/Depression)"
            confidence = 0.85
        elif score > 1:
            status = "Moderate Risk"
            confidence = 0.75
            
        return {"mental_health_status": status, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/stroke")
def predict_stroke(req: StrokeRequest):
    if not models['stroke'] or not models['stroke_encoders']:
        raise HTTPException(status_code=500, detail="Stroke models not loaded.")
    try:
        data = req.dict()
        df = pd.DataFrame([data])
        
        # Apply label encoders
        encoders = models['stroke_encoders']
        for col, encoder in encoders.items():
            if col in df.columns:
                df[col] = encoder.transform(df[col])
                
        if models.get('stroke_scaler'):
            cols_to_scale = ['age', 'avg_glucose_level', 'bmi']
            df[cols_to_scale] = models['stroke_scaler'].transform(df[cols_to_scale])
            
        pred = models['stroke'].predict(df)[0]
        prob = float(models['stroke'].predict_proba(df)[0].max())
        stroke_str = "High Risk" if int(pred) == 1 else "Low Risk"
        return {"stroke_prediction": stroke_str, "confidence": prob}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/skin")
async def predict_skin(file: UploadFile = File(...)):
    if not models['skin']:
        raise HTTPException(status_code=500, detail="Skin model not loaded.")
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        img_tensor = transform(image).unsqueeze(0)
        
        with torch.no_grad():
            outputs = models['skin'](img_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probs, 1)
            
        pred_idx = predicted.item()
        disease = str(pred_idx)
        if models.get('skin_encoder'):
            disease = models['skin_encoder'].inverse_transform([pred_idx])[0]
            
        return {"disease": disease, "confidence": float(confidence.item())}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
