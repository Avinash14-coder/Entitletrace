# EntitleTrace OpenAPI Specification & REST API Reference

The EntitleTrace backend is built on **FastAPI** and runs on `http://localhost:8000/v1`.
Interactive Swagger UI is accessible at `http://localhost:8000/docs`.

---

## Endpoint Overview

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/health` | System health check, loaded indices, and models |
| `GET` | `/v1/schemes` | List/Search schemes with query, level, state, category filters & pagination |
| `GET` | `/v1/schemes/{id}` | Get scheme detail and segmented clauses |
| `POST` | `/v1/extract` | Extract text page-by-page from uploaded documents (PDF, DOCX, TXT, Image) |
| `POST` | `/v1/analyze` | Core analysis pipeline: rule evaluation, NLP classification, clause linking |
| `GET` | `/v1/analytics/failures` | Analytics breakdown of failure types, languages, and schemes |
| `GET` | `/v1/analytics/topics` | Topic modeling themes extracted from rejection remarks |
| `GET` | `/v1/taxonomy` | Failure taxonomy categories with multilingual labels and action templates |

---

## Sample Request / Response

### 1. `POST /v1/analyze`

**Request Body:**
```json
{
  "scheme_id": "SCH_POST_MATRIC_OBC",
  "language": "en",
  "case": {
    "applicant": {
      "age": 21,
      "annual_income": 320000,
      "category": "OBC",
      "state": "Maharashtra"
    },
    "documents": [
      {
        "type": "income_certificate",
        "issue_date": "2025-05-10",
        "text": "Income certificate issued 14 months ago"
      },
      { "type": "caste_certificate" },
      { "type": "aadhaar" }
    ]
  },
  "remark": "Income proof not valid."
}
```

**Response Body:**
```json
{
  "scheme_id": "SCH_POST_MATRIC_OBC",
  "language": "en",
  "primary_failure": {
    "label": "expired_or_invalid_document",
    "display_name": "Expired or Invalid Document",
    "probability": 0.95,
    "description": "Submitted document has passed its official validity period or is legally invalid."
  },
  "secondary_failures": [
    {
      "label": "eligibility_income",
      "probability": 0.04
    }
  ],
  "entities": [
    {
      "start": 0,
      "end": 12,
      "label": "DOCUMENT_TYPE",
      "text": "Income proof"
    }
  ],
  "rule_checks": [
    {
      "rule_id": "obc_income_cert_validity",
      "type": "max_age_days",
      "passed": false,
      "expected": "≤ 365 days old",
      "actual": "420 days old (Expired, max 365 allowed)",
      "clause_ref": "SCH_POST_MATRIC_OBC_DOCS_1"
    }
  ],
  "linked_clauses": [
    {
      "clause_id": "SCH_POST_MATRIC_OBC_DOCS_1",
      "scheme_id": "SCH_POST_MATRIC_OBC",
      "scheme_name": "Post Matric Scholarship for OBC Students",
      "section": "documents",
      "text": "Valid Income Certificate issued by Tahsildar (Max 1 year old, showing income ≤ ₹1.5 Lakh).",
      "score": 0.0328,
      "source_url": "https://mahadbt.maharashtra.gov.in"
    }
  ],
  "suggested_action": "Obtain a fresh, renewed Income Certificate issued within the allowed validity period (maximum 365 days old).",
  "confidence": 0.95,
  "needs_human_review": false,
  "models_used": [
    "rule_engine_v1",
    "regex_gazetteer_ner",
    "tfidf_logistic_regression_v1"
  ],
  "warnings": []
}
```
