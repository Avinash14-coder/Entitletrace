import pytest
from datetime import date, timedelta
from backend.app.rules.engine import RuleEngine

@pytest.fixture
def engine():
    return RuleEngine("config/demo_schemes.yaml")

def test_income_max_rule_pass(engine):
    case = {
        "applicant": {
            "annual_income": 200000,
            "age": 20,
            "category": "SC"
        },
        "documents": [
            {"type": "income_certificate", "issue_date": str(date.today() - timedelta(days=100))},
            {"type": "caste_certificate"},
            {"type": "aadhaar"},
            {"type": "marksheet"},
            {"type": "bank_passbook"}
        ]
    }
    results = engine.evaluate_scheme("SCH_POST_MATRIC_SC", case)
    income_rule = next(r for r in results if r["rule_id"] == "sc_income_limit")
    assert income_rule["passed"] is True
    assert income_rule["actual"] == "200000"

def test_income_max_rule_fail(engine):
    case = {
        "applicant": {
            "annual_income": 320000,
            "age": 20,
            "category": "SC"
        },
        "documents": []
    }
    results = engine.evaluate_scheme("SCH_POST_MATRIC_SC", case)
    income_rule = next(r for r in results if r["rule_id"] == "sc_income_limit")
    assert income_rule["passed"] is False
    assert income_rule["actual"] == "320000"

def test_document_max_age_expired(engine):
    old_date = date.today() - timedelta(days=400)
    case = {
        "applicant": {"annual_income": 200000, "age": 22, "category": "OBC", "state": "Maharashtra"},
        "documents": [
            {"type": "income_certificate", "issue_date": str(old_date)},
            {"type": "caste_certificate"},
            {"type": "non_creamy_layer"},
            {"type": "domicile_certificate"},
            {"type": "marksheet"},
            {"type": "aadhaar"}
        ]
    }
    results = engine.evaluate_scheme("SCH_POST_MATRIC_OBC", case)
    validity_rule = next(r for r in results if r["rule_id"] == "obc_income_cert_validity")
    assert validity_rule["passed"] is False
    assert "Expired" in validity_rule["actual"]

def test_missing_documents_rule(engine):
    case = {
        "applicant": {"annual_income": 200000, "age": 22, "category": "OBC", "state": "Maharashtra"},
        "documents": [
            {"type": "aadhaar"}
        ]
    }
    results = engine.evaluate_scheme("SCH_POST_MATRIC_OBC", case)
    doc_rule = next(r for r in results if r["rule_id"] == "obc_required_docs")
    assert doc_rule["passed"] is False
    assert "income_certificate" in doc_rule["missing_documents"]
