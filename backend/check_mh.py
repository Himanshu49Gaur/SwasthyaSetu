import joblib

try:
    feature_encoders = joblib.load('model 4/mh_feature_encoders.pkl')
    print("Mental Health Features expected:", list(feature_encoders.keys()))
    for k, v in feature_encoders.items():
        print(f"  {k}: {list(v.classes_)}")
except Exception as e:
    print("Error loading feature encoders:", e)
