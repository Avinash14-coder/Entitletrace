import os
import re
import pickle
import json
import pandas as pd
import numpy as np
from rank_bm25 import BM25Okapi
from sklearn.feature_extraction.text import TfidfVectorizer
from sqlalchemy import create_engine, Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker

CLAUSES_PARQUET_PATH = "data/processed/clauses.parquet"
SCHEMES_PARQUET_PATH = "data/processed/schemes.parquet"
INDEX_DIR = "data/index"
DB_URL = "sqlite:///data/entitletrace.db"

Base = declarative_base()

class ClauseModel(Base):
    __tablename__ = "clauses"

    clause_id = Column(String, primary_key=True, index=True)
    scheme_id = Column(String, index=True)
    scheme_name = Column(String)
    section = Column(String)  # eligibility | documents | process | benefits
    order = Column(Integer)
    text = Column(Text, nullable=False)
    source_url = Column(String)

def tokenize(text: str) -> list[str]:
    return [w.lower() for w in re.findall(r'\w+', text)]

def segment_text_into_clauses(text: str, scheme_id: str, scheme_name: str, section: str, source_url: str) -> list[dict]:
    if not text or pd.isna(text):
        return []
    
    # Split by lines or numbered lists / bullets
    raw_lines = re.split(r'\n|(?<=\.)\s+(?=[1-9]\.|\•|\-)', str(text))
    clauses = []
    current_frag = ""

    for line in raw_lines:
        cleaned = line.strip()
        if not cleaned:
            continue
        
        # Remove leading numbers/bullets like "1.", "•", "-"
        cleaned_body = re.sub(r'^[0-9]+[\.\)]\s*|^[\•\-\*]\s*', '', cleaned).strip()
        words = cleaned_body.split()

        if len(words) < 8 and current_frag:
            current_frag += " " + cleaned_body
        else:
            if current_frag:
                clauses.append(current_frag)
            current_frag = cleaned_body

    if current_frag:
        clauses.append(current_frag)

    clause_objs = []
    for idx, c_text in enumerate(clauses):
        cid = f"{scheme_id}_{section.upper()[:4]}_{idx+1}"
        clause_objs.append({
            "clause_id": cid,
            "scheme_id": scheme_id,
            "scheme_name": scheme_name,
            "section": section,
            "order": idx + 1,
            "text": c_text,
            "source_url": source_url
        })

    return clause_objs

def build_index():
    if not os.path.exists(SCHEMES_PARQUET_PATH):
        raise FileNotFoundError(f"Schemes parquet not found at {SCHEMES_PARQUET_PATH}")

    df_schemes = pd.read_parquet(SCHEMES_PARQUET_PATH)
    all_clauses = []

    sections = [
        ("eligibility", "eligibility"),
        ("documents_required", "documents"),
        ("application_process", "process"),
        ("benefits", "benefits")
    ]

    for _, row in df_schemes.iterrows():
        sid = str(row["scheme_id"])
        sname = str(row.get("name", ""))
        surl = str(row.get("source_url", ""))

        for col_name, sec_label in sections:
            sec_text = str(row.get(col_name, ""))
            c_list = segment_text_into_clauses(sec_text, sid, sname, sec_label, surl)
            all_clauses.extend(c_list)

    df_clauses = pd.DataFrame(all_clauses)
    os.makedirs("data/processed", exist_ok=True)
    df_clauses.to_parquet(CLAUSES_PARQUET_PATH, index=False)
    print(f"Segmented {len(df_clauses)} clauses saved to {CLAUSES_PARQUET_PATH}")

    # Populate SQLite table
    engine = create_engine(DB_URL)
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    session.query(ClauseModel).delete()
    for _, row in df_clauses.iterrows():
        cmodel = ClauseModel(
            clause_id=row["clause_id"],
            scheme_id=row["scheme_id"],
            scheme_name=row["scheme_name"],
            section=row["section"],
            order=int(row["order"]),
            text=row["text"],
            source_url=row["source_url"]
        )
        session.add(cmodel)
    session.commit()
    session.close()

    # Build Index
    os.makedirs(INDEX_DIR, exist_ok=True)
    
    # Save clause records JSON for fast loading
    with open(os.path.join(INDEX_DIR, "clauses.json"), "w", encoding="utf-8") as f:
        json.dump(all_clauses, f, indent=2, ensure_ascii=False)

    # 1. BM25 Sparse Index
    tokenized_corpus = [tokenize(c["text"]) for c in all_clauses]
    bm25 = BM25Okapi(tokenized_corpus)
    with open(os.path.join(INDEX_DIR, "bm25.pkl"), "wb") as f:
        pickle.dump({"bm25": bm25, "clauses": all_clauses}, f)

    # 2. TF-IDF Vectorizer Matrix for Sparse Vector Fallback
    tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
    corpus_texts = [f"{c['scheme_name']} {c['section']} {c['text']}" for c in all_clauses]
    tfidf_matrix = tfidf.fit_transform(corpus_texts)
    
    with open(os.path.join(INDEX_DIR, "tfidf.pkl"), "wb") as f:
        pickle.dump({"tfidf": tfidf, "matrix": tfidf_matrix}, f)

    print(f"Hybrid retrieval index built successfully in {INDEX_DIR}")

if __name__ == "__main__":
    build_index()
