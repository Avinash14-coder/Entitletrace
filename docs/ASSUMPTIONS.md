# EntitleTrace — System & Data Assumptions (`ASSUMPTIONS.md`)

## 1. Environment & Data Profiling Verification ([VERIFY])

| Item | Expected | Verification Result / Recorded Finding |
|---|---|---|
| **Python Version** | Python 3.11+ | Python 3.13.12 verified on local system. All dependencies (FastAPI, PyMuPDF, PyArrow, sentence-transformers, SQLAlchemy, Pydantic v2) compatible. |
| **Dataset Source** | Kaggle myScheme India | 27 fields loaded and mapped via `config/columns.yaml`. Handled free-text eligibility and document structures. |
| **Dataset Structure** | CSV format | Successfully profiled in `data/profile_dataset.py`. Stored in `data/raw/myscheme.csv`. Column names normalized via `config/columns.yaml`. |
| **Eligibility Text** | Free-form prose | Verified numeric rules (income ceilings, age limits, validity periods) cannot be 100% regex-extracted across all 4,670 schemes. Hand-curated deterministic rules are maintained in `config/demo_schemes.yaml` with explicit clause references. |
| **OCR Support** | Tesseract / PaddleOCR | Optional runtime support enabled. If OCR engine binaries are missing, `/v1/extract` provides structured fallback notice without crashing. |

## 2. Architectural Assumptions & Fixed Decisions

1. **Rule Engine Isolation**: Deterministic checks take precedence over statistical classifier output. If a deterministic check fails (e.g., income > ₹2,50,000), `eligibility_income` is flagged with high confidence regardless of NLP classifier predictions.
2. **Clause Retrieval Scoping**: If `scheme_id` is supplied in `POST /v1/analyze`, hybrid search (FAISS + BM25) is filtered to clauses under that `scheme_id`. If `scheme_id` is null, global clause retrieval is performed to detect relevant schemes.
3. **Multilingual Support**: Rejection remarks in English, Hindi (Devanagari script), and Marathi (Devanagari script) are supported. Action templates are localized in `config/taxonomy.yaml`.
4. **Synthetic Data Policy**: All application records, Aadhaar numbers, names, and issue dates in `data/synthetic/cases.jsonl` are 100% artificial. No real PII is stored or processed.
5. **Node/Next.js and Python Separation**: Next.js route handlers act as a thin proxy to the FastAPI REST endpoints (`http://localhost:8000/v1`). All NLP, rule evaluation, and indexing are strictly executed in Python.
