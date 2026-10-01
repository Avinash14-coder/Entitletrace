import os
import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import NMF

SYNTHETIC_CASES_PATH = "data/synthetic/cases.jsonl"

def extract_topics(num_topics: int = 5, top_n_terms: int = 6) -> list[dict]:
    if not os.path.exists(SYNTHETIC_CASES_PATH):
        return []

    remarks = []
    cases_map = []
    with open(SYNTHETIC_CASES_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                item = json.loads(line)
                rem = item.get("remark", "")
                if rem:
                    remarks.append(rem)
                    cases_map.append(item)

    if not remarks:
        return []

    vectorizer = TfidfVectorizer(max_df=0.85, min_df=2, stop_words='english')
    X = vectorizer.fit_transform(remarks)

    feature_names = vectorizer.get_feature_names_out()
    nmf = NMF(n_components=min(num_topics, len(remarks)), random_state=42, max_iter=300)
    W = nmf.fit_transform(X)
    H = nmf.components_

    topics = []
    for topic_idx, topic in enumerate(H):
        top_features_ind = topic.argsort()[:-top_n_terms - 1:-1]
        top_terms = [feature_names[i] for i in top_features_ind]
        
        # Get sample remarks with high weight for this topic
        top_doc_indices = W[:, topic_idx].argsort()[:-4:-1]
        sample_remarks = [remarks[i] for i in top_doc_indices]
        sample_schemes = list(set([cases_map[i]["scheme_name"] for i in top_doc_indices]))

        topics.append({
            "topic_id": topic_idx + 1,
            "title": f"Theme {topic_idx + 1}: {', '.join(top_terms[:3]).title()}",
            "top_terms": top_terms,
            "sample_remarks": sample_remarks,
            "associated_schemes": sample_schemes,
            "weight_pct": round(float(np.mean(W[:, topic_idx])) * 100, 2)
        })

    return topics
