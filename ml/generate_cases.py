import os
import json
import random
from datetime import date, timedelta
import pandas as pd
from ml.templates.remarks import REMARK_TEMPLATES

OUTPUT_CASES_PATH = "data/synthetic/cases.jsonl"
OUTPUT_LABEL_STUDIO = "data/annotations/label_studio_export.json"
SCHEMES_PARQUET = "data/processed/schemes.parquet"
CLAUSES_PARQUET = "data/processed/clauses.parquet"

NAMES_EN = ["Aarav Sharma", "Priya Patil", "Rahul Verma", "Sunita Deshmukh", "Vikram Singh", "Ananya Kamble", "Rohan Gupta", "Pooja Jadhav"]
NAMES_HI = ["आरव शर्मा", "प्रिया वर्मा", "राहुल सिंह", "सुनीता गुप्ता", "विक्रम यादव", "अनन्या कुमार"]
NAMES_MR = ["आरव पाटील", "प्रिया देशपांडे", "राहुल कांबळे", "सुनीता जाधव", "विक्रम गायकवाड", "अनन्या मोरे"]

DOCUMENT_TYPES = [
    "income_certificate", "caste_certificate", "domicile_certificate", "aadhaar",
    "bank_passbook", "marksheet", "birth_certificate", "land_record", "vending_certificate"
]

FAILURE_TAXONOMY = [
    "missing_document", "expired_or_invalid_document", "eligibility_income",
    "eligibility_age", "eligibility_category_or_residence", "document_mismatch",
    "incomplete_or_incorrect_form", "deadline_or_process_error", "duplicate_application",
    "verification_pending_or_unspecified"
]

def add_ocr_noise(text: str) -> str:
    if random.random() > 0.3:
        return text
    # Introduce small typo/character swap or broken line
    chars = list(text)
    if len(chars) > 5:
        idx = random.randint(0, len(chars) - 2)
        chars[idx], chars[idx+1] = chars[idx+1], chars[idx]
    return "".join(chars)

def generate_synthetic_cases(total_cases: int = 360):
    if not os.path.exists(SCHEMES_PARQUET) or not os.path.exists(CLAUSES_PARQUET):
        raise FileNotFoundError("Prerequisite parquets missing. Run clean_schemes.py and build_index.py first.")

    df_schemes = pd.read_parquet(SCHEMES_PARQUET)
    df_clauses = pd.read_parquet(CLAUSES_PARQUET)

    demo_scheme_ids = df_schemes["scheme_id"].tolist()
    held_out_schemes = ["SCH_POST_MATRIC_OBC", "SCH_PM_SVANIDHI"]

    cases = []
    case_counter = 1

    languages = ["en", "hi", "mr"]
    
    for i in range(total_cases):
        scheme_id = random.choice(demo_scheme_ids)
        scheme_row = df_schemes[df_schemes["scheme_id"] == scheme_id].iloc[0]
        scheme_name = scheme_row["name"]
        
        lang = random.choice(languages)
        failure_type = random.choice(FAILURE_TAXONOMY)
        
        # Valid baseline applicant
        base_income = 180000
        base_age = 22
        base_category = "SC" if "SC" in scheme_id else ("OBC" if "OBC" in scheme_id else "General")
        base_state = scheme_row["state"] if scheme_row["state"] != "All India" else "Maharashtra"

        missing_doc_name = "income_certificate"
        income_val = base_income
        age_val = base_age
        category_val = base_category
        state_val = base_state
        doc_issue_days = random.randint(10, 180)
        
        secondary_failures = []
        
        # Inject defect based on failure_type
        if failure_type == "missing_document":
            missing_doc_name = random.choice(["income_certificate", "caste_certificate", "domicile_certificate"])
        elif failure_type == "expired_or_invalid_document":
            doc_issue_days = random.randint(380, 720) # Expired > 1 year
        elif failure_type == "eligibility_income":
            income_val = random.choice([320000, 450000, 600000])
        elif failure_type == "eligibility_age":
            age_val = random.choice([14, 45, 75])
        elif failure_type == "eligibility_category_or_residence":
            category_val = "General"
            state_val = "Gujarat" if base_state == "Maharashtra" else "Karnataka"

        # Build applicant & documents
        if lang == "hi":
            applicant_name = random.choice(NAMES_HI)
        elif lang == "mr":
            applicant_name = random.choice(NAMES_MR)
        else:
            applicant_name = random.choice(NAMES_EN)

        docs = []
        all_doc_types = ["aadhaar", "bank_passbook", "income_certificate", "caste_certificate", "domicile_certificate", "marksheet"]
        for dt in all_doc_types:
            if failure_type == "missing_document" and dt == missing_doc_name:
                continue
            
            i_date = date.today() - timedelta(days=doc_issue_days if dt == "income_certificate" else random.randint(30, 300))
            docs.append({
                "type": dt,
                "issue_date": str(i_date),
                "valid_till": str(i_date + timedelta(days=365)),
                "text": add_ocr_noise(f"Government Official {dt.replace('_', ' ').title()} issued for {applicant_name}")
            })

        # Generate remark from template
        template_list = REMARK_TEMPLATES.get(failure_type, {}).get(lang, REMARK_TEMPLATES[failure_type]["en"])
        raw_remark = random.choice(template_list)
        
        # Format variables in remark
        remark_text = raw_remark.replace("{{missing_doc}}", missing_doc_name.replace("_", " "))
        remark_text = remark_text.replace("{{income}}", f"{income_val:,}")
        remark_text = remark_text.replace("{{limit}}", "2,50,000")
        remark_text = remark_text.replace("{{age}}", str(age_val))
        remark_text = remark_text.replace("{{min_age}}", "18")
        remark_text = remark_text.replace("{{max_age}}", "35")
        remark_text = remark_text.replace("{{required_state}}", base_state)

        # Retrieve matching gold clause IDs from clauses dataset
        scheme_clauses = df_clauses[df_clauses["scheme_id"] == scheme_id]
        gold_clause_ids = []
        if not scheme_clauses.empty:
            gold_clause_ids = scheme_clauses["clause_id"].head(2).tolist()

        # Build entity spans in remark / case
        entities = []
        if str(income_val) in remark_text or f"{income_val:,}" in remark_text:
            matched_str = str(income_val) if str(income_val) in remark_text else f"{income_val:,}"
            idx = remark_text.find(matched_str)
            entities.append({
                "start": idx,
                "end": idx + len(matched_str),
                "label": "AMOUNT_INCOME",
                "text": matched_str
            })
        if str(age_val) in remark_text:
            idx = remark_text.find(str(age_val))
            entities.append({
                "start": idx,
                "end": idx + len(str(age_val)),
                "label": "AGE",
                "text": str(age_val)
            })

        # Train/Val/Test Split (70/15/15)
        rnd_val = random.random()
        if rnd_val < 0.70:
            split = "train"
        elif rnd_val < 0.85:
            split = "val"
        else:
            split = "test"

        held_out_split = "test" if scheme_id in held_out_schemes else "train"

        case_record = {
            "case_id": f"CASE_{case_counter:04d}",
            "scheme_id": scheme_id,
            "scheme_name": scheme_name,
            "language": lang,
            "applicant": {
                "name": applicant_name,
                "age": age_val,
                "annual_income": income_val,
                "category": category_val,
                "state": state_val
            },
            "documents": docs,
            "remark": remark_text,
            "primary_failure": failure_type,
            "secondary_failures": secondary_failures,
            "gold_clause_ids": gold_clause_ids,
            "entities": entities,
            "split": split,
            "held_out_scheme_split": held_out_split
        }
        cases.append(case_record)
        case_counter += 1

    # Save cases.jsonl
    os.makedirs("data/synthetic", exist_ok=True)
    with open(OUTPUT_CASES_PATH, "w", encoding="utf-8") as f:
        for c in cases:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")

    print(f"Generated {len(cases)} synthetic application cases in {OUTPUT_CASES_PATH}")

    # Export subset to Label Studio format
    label_studio_tasks = []
    for c in cases[:50]:
        label_studio_tasks.append({
            "id": c["case_id"],
            "data": {
                "text": c["remark"],
                "scheme": c["scheme_name"],
                "language": c["language"],
                "applicant_income": c["applicant"]["annual_income"],
                "applicant_age": c["applicant"]["age"]
            },
            "predictions": [{
                "model_version": "baseline_rule_v1",
                "result": [
                    {
                        "from_name": "failure_category",
                        "to_name": "text",
                        "type": "choices",
                        "value": {"choices": [c["primary_failure"]]}
                    }
                ]
            }]
        })

    os.makedirs("data/annotations", exist_ok=True)
    with open(OUTPUT_LABEL_STUDIO, "w", encoding="utf-8") as f:
        json.dump(label_studio_tasks, f, indent=2, ensure_ascii=False)

    print(f"Exported {len(label_studio_tasks)} tasks for Label Studio in {OUTPUT_LABEL_STUDIO}")

if __name__ == "__main__":
    generate_synthetic_cases(360)
