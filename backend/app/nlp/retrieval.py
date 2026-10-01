import os
import re
import pickle
import numpy as np
from rank_bm25 import BM25Okapi

INDEX_DIR = "data/index"

def tokenize(text: str) -> list[str]:
    return [w.lower() for w in re.findall(r'\w+', text)]

class ClauseRetriever:
    def __init__(self, index_dir: str = INDEX_DIR):
        self.index_dir = index_dir
        self.bm25 = None
        self.tfidf = None
        self.tfidf_matrix = None
        self.clauses = []
        self._load_index()

    def _load_index(self):
        bm25_path = os.path.join(self.index_dir, "bm25.pkl")
        tfidf_path = os.path.join(self.index_dir, "tfidf.pkl")

        if os.path.exists(bm25_path):
            with open(bm25_path, "rb") as f:
                data = pickle.load(f)
                self.bm25 = data["bm25"]
                self.clauses = data["clauses"]

        if os.path.exists(tfidf_path):
            with open(tfidf_path, "rb") as f:
                tdata = pickle.load(f)
                self.tfidf = tdata["tfidf"]
                self.tfidf_matrix = tdata["matrix"]

    def retrieve(self, query: str, scheme_id: str = None, top_k: int = 5) -> list[dict]:
        if not self.clauses or not query:
            return []

        # Filter indices by scheme_id if provided
        candidate_indices = []
        for idx, clause in enumerate(self.clauses):
            if scheme_id is None or clause["scheme_id"] == scheme_id:
                candidate_indices.append(idx)

        if not candidate_indices:
            return []

        query_tokens = tokenize(query)

        # 1. BM25 Scores
        bm25_raw_scores = self.bm25.get_scores(query_tokens) if self.bm25 else np.zeros(len(self.clauses))
        
        # 2. TF-IDF Cosine Scores
        if self.tfidf and self.tfidf_matrix is not None:
            q_vec = self.tfidf.transform([query])
            tfidf_raw_scores = (self.tfidf_matrix * q_vec.T).toarray().flatten()
        else:
            tfidf_raw_scores = np.zeros(len(self.clauses))

        # Combine via Reciprocal Rank Fusion (RRF) over candidates
        bm25_candidate_ranks = sorted(candidate_indices, key=lambda i: bm25_raw_scores[i], reverse=True)
        tfidf_candidate_ranks = sorted(candidate_indices, key=lambda i: tfidf_raw_scores[i], reverse=True)

        rrf_scores = {}
        k_rrf = 60
        for rank, c_idx in enumerate(bm25_candidate_ranks):
            rrf_scores[c_idx] = rrf_scores.get(c_idx, 0.0) + (1.0 / (k_rrf + rank + 1))
        
        for rank, c_idx in enumerate(tfidf_candidate_ranks):
            rrf_scores[c_idx] = rrf_scores.get(c_idx, 0.0) + (1.0 / (k_rrf + rank + 1))

        # Sort candidate indices by combined RRF score
        sorted_candidates = sorted(candidate_indices, key=lambda i: rrf_scores.get(i, 0), reverse=True)[:top_k]

        results = []
        for rank, idx in enumerate(sorted_candidates):
            c_item = self.clauses[idx].copy()
            c_item["score"] = round(float(rrf_scores.get(idx, 0.0)), 4)
            c_item["rank"] = rank + 1
            results.append(c_item)

        return results

_retriever_instance = None

def get_retriever():
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = ClauseRetriever()
    return _retriever_instance
