import os
import json
import pickle
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

MODEL_DIR = "models"
CLASSIFIER_PATH = os.path.join(MODEL_DIR, "baseline_classifier.pkl")
SYNTHETIC_CASES_PATH = "data/synthetic/cases.jsonl"

class FailureClassifier:
    def __init__(self, model_path: str = CLASSIFIER_PATH):
        self.model_path = model_path
        self.vectorizer = None
        self.clf = None
        self.classes_ = []
        self._load_or_train()

    def _load_or_train(self):
        if os.path.exists(self.model_path):
            with open(self.model_path, "rb") as f:
                data = pickle.load(f)
                self.vectorizer = data["vectorizer"]
                self.clf = data["clf"]
                self.classes_ = data["classes"]
        else:
            self.train_baseline()

    def train_baseline(self):
        if not os.path.exists(SYNTHETIC_CASES_PATH):
            print("Synthetic cases not found. Skipping classifier training.")
            return

        texts = []
        labels = []
        with open(SYNTHETIC_CASES_PATH, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    item = json.loads(line)
                    remark = item.get("remark", "")
                    cat = item.get("primary_failure")
                    if remark and cat:
                        texts.append(remark)
                        labels.append(cat)

        if not texts:
            return

        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
        X = self.vectorizer.fit_transform(texts)
        self.clf = LogisticRegression(max_iter=500, C=1.0)
        self.clf.fit(X, labels)
        self.classes_ = list(self.clf.classes_)

        os.makedirs(self.model_path.rsplit(os.sep, 1)[0], exist_ok=True)
        with open(self.model_path, "wb") as f:
            pickle.dump({
                "vectorizer": self.vectorizer,
                "clf": self.clf,
                "classes": self.classes_
            }, f)
        print(f"Trained baseline classifier on {len(texts)} samples and saved to {self.model_path}")

    def predict(self, text: str, top_k: int = 3) -> dict:
        if not self.clf or not self.vectorizer or not text:
            return {
                "primary_failure": {"label": "verification_pending_or_unspecified", "probability": 0.5},
                "secondary_failures": [],
                "models_used": ["rule_based_fallback"]
            }

        X_vec = self.vectorizer.transform([text])
        probs = self.clf.predict_proba(X_vec)[0]
        
        # Sort classes by probability descending
        top_indices = np.argsort(probs)[::-1]
        
        results = []
        for idx in top_indices[:top_k]:
            results.append({
                "label": str(self.classes_[idx]),
                "probability": round(float(probs[idx]), 4)
            })

        primary = results[0] if results else {"label": "verification_pending_or_unspecified", "probability": 0.5}
        secondary = results[1:] if len(results) > 1 else []

        return {
            "primary_failure": primary,
            "secondary_failures": secondary,
            "models_used": ["tfidf_logistic_regression_v1"]
        }

_classifier_instance = None

def get_classifier():
    global _classifier_instance
    if _classifier_instance is None:
        _classifier_instance = FailureClassifier()
    return _classifier_instance
