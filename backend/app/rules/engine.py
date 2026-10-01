from decimal import Decimal
from datetime import datetime, date
import yaml
import os

DEMO_SCHEMES_PATH = "config/demo_schemes.yaml"

class RuleEngine:
    def __init__(self, demo_rules_path: str = DEMO_SCHEMES_PATH):
        self.rules_by_scheme = {}
        if os.path.exists(demo_rules_path):
            with open(demo_rules_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f) or {}
                for sch in data.get("demo_schemes", []):
                    self.rules_by_scheme[sch["scheme_id"]] = sch.get("rules", [])

    def evaluate_scheme(self, scheme_id: str, case_data: dict, app_date: date = None) -> list[dict]:
        """
        Evaluates deterministic rules for a given scheme against case data.
        """
        if app_date is None:
            app_date = date.today()

        rules = self.rules_by_scheme.get(scheme_id, [])
        results = []

        applicant = case_data.get("applicant", {})
        documents = case_data.get("documents", [])
        
        # Build map of submitted document types -> list of doc dicts
        submitted_doc_map = {}
        for doc in documents:
            dtype = str(doc.get("type", "")).strip().lower()
            if dtype not in submitted_doc_map:
                submitted_doc_map[dtype] = []
            submitted_doc_map[dtype].append(doc)

        for rule in rules:
            rtype = rule.get("type")
            rid = rule.get("id")
            clause_ref = rule.get("clause_ref", "")
            desc = rule.get("description", "")

            if rtype == "numeric_max":
                field = rule["field"]
                limit = Decimal(str(rule["value"]))
                actual_val = applicant.get(field)
                if actual_val is None:
                    passed = False
                    actual_str = "Not provided"
                else:
                    actual_dec = Decimal(str(actual_val))
                    passed = actual_dec <= limit
                    actual_str = f"{actual_dec}"

                results.append({
                    "rule_id": rid,
                    "type": rtype,
                    "passed": passed,
                    "expected": f"≤ {limit}",
                    "actual": actual_str,
                    "clause_ref": clause_ref,
                    "description": desc
                })

            elif rtype == "numeric_min":
                field = rule["field"]
                limit = Decimal(str(rule["value"]))
                actual_val = applicant.get(field)
                if actual_val is None:
                    passed = False
                    actual_str = "Not provided"
                else:
                    actual_dec = Decimal(str(actual_val))
                    passed = actual_dec >= limit
                    actual_str = f"{actual_dec}"

                results.append({
                    "rule_id": rid,
                    "type": rtype,
                    "passed": passed,
                    "expected": f"≥ {limit}",
                    "actual": actual_str,
                    "clause_ref": clause_ref,
                    "description": desc
                })

            elif rtype == "numeric_range":
                field = rule["field"]
                min_limit = Decimal(str(rule["min"]))
                max_limit = Decimal(str(rule["max"]))
                actual_val = applicant.get(field)
                if actual_val is None:
                    passed = False
                    actual_str = "Not provided"
                else:
                    actual_dec = Decimal(str(actual_val))
                    passed = min_limit <= actual_dec <= max_limit
                    actual_str = f"{actual_dec}"

                results.append({
                    "rule_id": rid,
                    "type": rtype,
                    "passed": passed,
                    "expected": f"Between {min_limit} and {max_limit}",
                    "actual": actual_str,
                    "clause_ref": clause_ref,
                    "description": desc
                })

            elif rtype == "documents_present":
                required_docs = rule["documents"]
                missing = []
                for req in required_docs:
                    req_norm = req.strip().lower()
                    if req_norm not in submitted_doc_map:
                        missing.append(req)
                
                passed = len(missing) == 0
                results.append({
                    "rule_id": rid,
                    "type": rtype,
                    "passed": passed,
                    "expected": f"All required: {', '.join(required_docs)}",
                    "actual": f"Missing: {', '.join(missing)}" if missing else "All present",
                    "clause_ref": clause_ref,
                    "description": desc,
                    "missing_documents": missing
                })

            elif rtype == "max_age_days":
                target_doc = rule["document"].strip().lower()
                max_days = int(rule["value"])
                doc_entries = submitted_doc_map.get(target_doc, [])
                if not doc_entries:
                    results.append({
                        "rule_id": rid,
                        "type": rtype,
                        "passed": False,
                        "expected": f"{target_doc} issued within {max_days} days",
                        "actual": f"{target_doc} not submitted",
                        "clause_ref": clause_ref,
                        "description": desc
                    })
                else:
                    # Check issue dates
                    valid = False
                    actual_info = []
                    for doc in doc_entries:
                        issue_str = doc.get("issue_date")
                        if not issue_str:
                            actual_info.append("Issue date missing")
                            continue
                        try:
                            idate = datetime.strptime(str(issue_str).strip()[:10], "%Y-%m-%d").date()
                            age_days = (app_date - idate).days
                            if age_days <= max_days:
                                valid = True
                                actual_info.append(f"{age_days} days old (Issued {issue_str})")
                            else:
                                actual_info.append(f"{age_days} days old (Expired, max {max_days} allowed)")
                        except ValueError:
                            actual_info.append(f"Invalid date format: {issue_str}")

                    results.append({
                        "rule_id": rid,
                        "type": rtype,
                        "passed": valid,
                        "expected": f"≤ {max_days} days old",
                        "actual": "; ".join(actual_info),
                        "clause_ref": clause_ref,
                        "description": desc
                    })

            elif rtype == "category_in":
                field = rule["field"]
                allowed = [str(a).strip().upper() for a in rule["allowed"]]
                actual_val = str(applicant.get(field, "")).strip().upper()
                passed = actual_val in allowed
                results.append({
                    "rule_id": rid,
                    "type": rtype,
                    "passed": passed,
                    "expected": f"One of {allowed}",
                    "actual": actual_val or "Not provided",
                    "clause_ref": clause_ref,
                    "description": desc
                })

            elif rtype == "state_in":
                field = rule["field"]
                allowed = [str(a).strip().upper() for a in rule["allowed"]]
                actual_val = str(applicant.get(field, "")).strip().upper()
                passed = actual_val in allowed or "ALL INDIA" in allowed
                results.append({
                    "rule_id": rid,
                    "type": rtype,
                    "passed": passed,
                    "expected": f"One of {allowed}",
                    "actual": actual_val or "Not provided",
                    "clause_ref": clause_ref,
                    "description": desc
                })

            elif rtype == "field_match":
                fields_to_check = rule.get("fields", ["name"])
                # Extract names/fields across docs
                values_found = set()
                if applicant.get("name"):
                    values_found.add(str(applicant["name"]).strip().lower())
                for doc in documents:
                    for f_key in fields_to_check:
                        if doc.get(f_key):
                            values_found.add(str(doc[f_key]).strip().lower())
                
                passed = len(values_found) <= 1
                results.append({
                    "rule_id": rid,
                    "type": rtype,
                    "passed": passed,
                    "expected": "Exact match across documents",
                    "actual": f"Found multiple variations: {list(values_found)}" if len(values_found) > 1 else "Matches",
                    "clause_ref": clause_ref,
                    "description": desc
                })

        return results
