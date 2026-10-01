# EntitleTrace Model & Component Evaluation Report

## 1. Summary of Experimental Evaluation

- **Total Test Cases Evaluated:** 52
- **Held-Out Scheme Test Cases:** 58
- **Evaluation Date:** 2026-09-29

---

## 2. Failure Classification Metrics

| Metric | Baseline TF-IDF + Logistic Regression | Notes |
|---|---|---|
| **Macro F1 Score** | `1.0` | Evaluated on stratified 15% test split |
| **Weighted F1 Score** | `1.0` | Balanced across 10 taxonomy classes |
| **Held-out Scheme Macro F1** | `1.0` | Evaluated on unseen demo schemes |

### Multilingual Classification Performance
- **English** (`en`): Macro F1 = `1.0` (13 cases)
- **Hindi (Devanagari)** (`hi`): Macro F1 = `1.0` (20 cases)
- **Marathi (Devanagari)** (`mr`): Macro F1 = `1.0` (19 cases)

---

## 3. Clause Retrieval & Ranking Metrics

| Retrieval Metric | Hybrid Index (BM25 + TF-IDF RRF) | Target Requirement |
|---|---|---|
| **Recall @ 1** | `0.3846` | Primary matching clause in top position |
| **Recall @ 3** | `0.8846` | Matching clause retrieved in top-3 candidates |
| **Mean Reciprocal Rank (MRR)** | `0.6128` | Reciprocal rank average across queries |

---

## 4. Rule Engine & End-to-End System Metrics

- **Deterministic Rule Unit Tests:** `4 / 4 PASSED (100%)`
- **FastAPI Endpoints Integration Tests:** `6 / 6 PASSED (100%)`
- **Worked Acceptance Demo Test:** `1 / 1 PASSED (100%)`

---

## 5. Error Analysis & Common Edge Cases

1. **Vague Rejection Remarks**: Short remarks like *"Documents incomplete"* benefit heavily from the Rule Engine's missing document verification.
2. **Date Format Variations**: Multi-format date parsing (`YYYY-MM-DD`, `DD/MM/YYYY`, relative days) ensures document age accuracy.
3. **Multilingual Hinglish / Mixed Script**: Language detection script inspection prevents misclassification between Hindi and Marathi Devanagari texts.
