import sys
import os
import json

# Ensure python knows UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from backend.app.services.analyze_case import get_analysis_service

def test_custom_cases():
    svc = get_analysis_service()
    
    # 1. Custom Case: Marathi remark & Income Ceiling exceeded
    case_marathi = {
        "applicant": {
            "name": "दिनेश पवार",
            "age": 22,
            "annual_income": 220000,
            "category": "OBC",
            "state": "Maharashtra"
        },
        "documents": [
            {"type": "income_certificate", "issue_date": "2024-01-01"},
            {"type": "caste_certificate"}
        ]
    }
    res_mr = svc.analyze(
        scheme_id="SCH_POST_MATRIC_OBC",
        case_data=case_marathi,
        remark_text="उत्पन्न मर्यादा जास्त आहे व प्रमाणपत्र जुने आहे",
        language_hint="mr"
    )
    print("--- Test 1: Marathi Custom Case ---")
    print("Language:", res_mr["language"])
    print("Primary Failure:", res_mr["primary_failure"]["display_name"])
    print("Suggested Action:", res_mr["suggested_action"])
    print("Failed Rules:", [r["rule_id"] for r in res_mr["rule_checks"] if not r["passed"]])
    print("Linked Clauses:", len(res_mr["linked_clauses"]))
    assert res_mr["primary_failure"]["label"] == "eligibility_income"
    assert len(res_mr["linked_clauses"]) > 0

    # 2. Custom Case: Hindi remark & Missing Documents
    case_hindi = {
        "applicant": {
            "name": "राहुल कुमार",
            "age": 21,
            "annual_income": 120000,
            "category": "SC",
            "state": "Maharashtra"
        },
        "documents": [
            {"type": "income_certificate", "issue_date": "2025-06-01"}
        ]
    }
    res_hi = svc.analyze(
        scheme_id="SCH_POST_MATRIC_SC",
        case_data=case_hindi,
        remark_text="जाति प्रमाण पत्र और बैंक पासबुक संलग्न नहीं है",
        language_hint="hi"
    )
    print("\n--- Test 2: Hindi Custom Case ---")
    print("Language:", res_hi["language"])
    print("Primary Failure:", res_hi["primary_failure"]["display_name"])
    print("Suggested Action:", res_hi["suggested_action"])
    print("Failed Rules:", [r["rule_id"] for r in res_hi["rule_checks"] if not r["passed"]])
    assert res_hi["primary_failure"]["label"] == "missing_document"

    # 3. Custom Case: General Category applying for OBC Scheme (Category mismatch)
    case_cat = {
        "applicant": {
            "name": "Ajay Sharma",
            "age": 20,
            "annual_income": 100000,
            "category": "General",
            "state": "Maharashtra"
        },
        "documents": [
            {"type": "income_certificate", "issue_date": "2025-08-01"},
            {"type": "caste_certificate"},
            {"type": "non_creamy_layer"},
            {"type": "domicile_certificate"},
            {"type": "marksheet"},
            {"type": "aadhaar"}
        ]
    }
    res_cat = svc.analyze(
        scheme_id="SCH_POST_MATRIC_OBC",
        case_data=case_cat,
        remark_text="Applicant category is not OBC.",
        language_hint="en"
    )
    print("\n--- Test 3: Category/Domicile Mismatch ---")
    print("Language:", res_cat["language"])
    print("Primary Failure:", res_cat["primary_failure"]["display_name"])
    print("Suggested Action:", res_cat["suggested_action"])
    print("Failed Rules:", [r["rule_id"] for r in res_cat["rule_checks"] if not r["passed"]])
    assert res_cat["primary_failure"]["label"] == "eligibility_category_or_residence"

    # 4. Custom Case: Auto-detect Scheme from Remark
    res_auto = svc.analyze(
        scheme_id=None,
        case_data={"applicant": {"name": "Pooja Patil", "age": 24, "annual_income": 140000}, "documents": []},
        remark_text="Income proof not valid. Certificate is more than 1 year old.",
        language_hint="en"
    )
    print("\n--- Test 4: Auto-detect Scheme from Remark ---")
    print("Primary Failure:", res_auto["primary_failure"]["display_name"])
    print("Suggested Action:", res_auto["suggested_action"])
    print("Linked Clauses:", len(res_auto["linked_clauses"]))
    assert res_auto["primary_failure"]["label"] == "expired_or_invalid_document"

    print("\nALL 4 CUSTOM CASE VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_custom_cases()
