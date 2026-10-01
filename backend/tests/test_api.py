import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["index_loaded"] is True

def test_schemes_endpoint():
    response = client.get("/v1/schemes")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    assert len(data["schemes"]) > 0

def test_scheme_detail_endpoint():
    response = client.get("/v1/schemes/SCH_POST_MATRIC_SC")
    assert response.status_code == 200
    data = response.json()
    assert data["scheme_id"] == "SCH_POST_MATRIC_SC"
    assert "clauses" in data
    assert len(data["clauses"]) > 0

def test_taxonomy_endpoint():
    response = client.get("/v1/taxonomy")
    assert response.status_code == 200
    data = response.json()
    assert "missing_document" in data
    assert "expired_or_invalid_document" in data

def test_analytics_failures_endpoint():
    response = client.get("/v1/analytics/failures")
    assert response.status_code == 200
    data = response.json()
    assert data["total_cases"] > 0

def test_analyze_endpoint():
    payload = {
        "scheme_id": "SCH_POST_MATRIC_SC",
        "language": "en",
        "case": {
            "applicant": {"age": 20, "annual_income": 350000, "category": "SC", "state": "Maharashtra"},
            "documents": [{"type": "income_certificate", "issue_date": "2025-01-01"}]
        },
        "remark": "Income above limit"
    }
    response = client.post("/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["primary_failure"]["label"] == "eligibility_income"
    assert len(data["linked_clauses"]) > 0
