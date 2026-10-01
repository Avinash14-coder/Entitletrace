import pytest
from datetime import date, timedelta
from backend.app.services.analyze_case import get_analysis_service

def test_worked_example_acceptance_demo():
    service = get_analysis_service()
    
    # 14 months ago = ~420 days ago
    issue_14_months_ago = str(date.today() - timedelta(days=420))
    
    case_input = {
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
                    "issue_date": issue_14_months_ago,
                    "text": "Income Certificate issued 14 months ago for ₹3,20,000"
                },
                {"type": "caste_certificate"},
                {"type": "non_creamy_layer"},
                {"type": "domicile_certificate"},
                {"type": "marksheet"},
                {"type": "aadhaar"}
            ]
        },
        "remark": "Income proof not valid."
    }

    result = service.analyze(
        scheme_id=case_input["scheme_id"],
        case_data=case_input["case"],
        remark_text=case_input["remark"],
        language_hint=case_input["language"]
    )

    assert result["primary_failure"]["label"] in ["expired_or_invalid_document", "eligibility_income"]
    assert len(result["rule_checks"]) > 0
    assert any(rc["passed"] is False for rc in result["rule_checks"])
    assert len(result["linked_clauses"]) > 0
    assert result["linked_clauses"][0]["scheme_id"] == "SCH_POST_MATRIC_OBC"
    assert "suggested_action" in result
    assert result["confidence"] > 0.7
