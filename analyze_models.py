import joblib
import os

model_paths = {
    "Model 1: Triage": "model 1/triage_model.pkl",
    "Model 2: Cardio": "model 2/cardio_gb_model.pkl",
    "Model 2: Maternal": "model 2/maternal_rf_model.pkl",
    "Model 3: Drug": "model 3/drug_sentiment_model.pkl",
    "Model 4: Mental Health": "model 4/mental_health_lgbm.pkl",
    "Model 5: Stroke": "model 5/stroke_rf_model.pkl"
}

for name, path in model_paths.items():
    print(f"--- {name} ---")
    try:
        model = joblib.load(path)
        
        if hasattr(model, 'feature_names_in_'):
            print("Feature Names:", model.feature_names_in_)
        elif hasattr(model, 'feature_name_'):
            print("Feature Names:", model.feature_name_())
        else:
            print("No feature names found.")
            
        if hasattr(model, 'n_features_in_'):
            print("Number of features:", model.n_features_in_)
            
    except Exception as e:
        print("Error loading:", e)
    print()
