import yaml
import os
from backend.app.nlp.lang import detect_language
from backend.app.nlp.ner import get_ner_extractor
from backend.app.nlp.classifier import get_classifier
from backend.app.nlp.retrieval import get_retriever
from backend.app.rules.engine import RuleEngine

TAXONOMY_PATH = "config/taxonomy.yaml"

def load_taxonomy():
    if os.path.exists(TAXONOMY_PATH):
        with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
            return yaml.safe_load(f).get("taxonomies", {})
    return {}

class AnalysisService:
    def __init__(self):
        self.rule_engine = RuleEngine()
        self.ner_extractor = get_ner_extractor()
        self.classifier = get_classifier()
        self.retriever = get_retriever()
        self.taxonomy = load_taxonomy()

    def analyze(self, scheme_id: str | None, case_data: dict, remark_text: str, language_hint: str = "auto") -> dict:
        warnings = []
        models_used = ["rule_engine_v1"]

        # 1. Language Detection
        if language_hint == "auto" or not language_hint:
            lang = detect_language(remark_text)
        else:
            lang = language_hint

        # 2. NER Extraction
        case_full_text = f"{remark_text} " + " ".join([str(v) for v in case_data.get("applicant", {}).values()])
        entities = self.ner_extractor.extract_entities(case_full_text)
        models_used.append("regex_gazetteer_ner")

        # 3. Deterministic Rule Checks
        rule_checks = []
        rule_failed_label = None
        rule_failed_details = {}

        if scheme_id:
            rule_checks = self.rule_engine.evaluate_scheme(scheme_id, case_data)
            failed_rules = [r for r in rule_checks if not r["passed"]]
            
            if failed_rules:
                first_failed = failed_rules[0]
                if first_failed["type"] == "numeric_max" and "income" in first_failed["rule_id"]:
                    rule_failed_label = "eligibility_income"
                    rule_failed_details = {"income_limit": first_failed["expected"].replace("≤ ", "")}
                elif first_failed["type"] == "max_age_days":
                    rule_failed_label = "expired_or_invalid_document"
                    rule_failed_details = {"document_type": "Income Certificate", "max_age_days": "365"}
                elif first_failed["type"] == "documents_present":
                    rule_failed_label = "missing_document"
                    rule_failed_details = {"missing_docs": first_failed.get("actual", "required document")}
                elif first_failed["type"] in ["numeric_min", "numeric_range"] and "age" in first_failed["rule_id"]:
                    rule_failed_label = "eligibility_age"
                    rule_failed_details = {"min_age": "18", "max_age": "35"}

        # 4. Classifier Prediction
        clf_result = self.classifier.predict(remark_text)
        models_used.extend(clf_result.get("models_used", []))

        # Reconcile Rule Check & Classifier
        if rule_failed_label:
            primary_label = rule_failed_label
            confidence = 0.95
            needs_human_review = False
        else:
            primary_label = clf_result["primary_failure"]["label"]
            confidence = clf_result["primary_failure"]["probability"]
            needs_human_review = confidence < 0.65

        # 5. Hybrid Retrieval
        query = f"{remark_text} {primary_label.replace('_', ' ')}"
        linked_clauses = self.retriever.retrieve(query, scheme_id=scheme_id, top_k=5)

        # 6. Format Taxonomy & Suggested Action
        tax_info = self.taxonomy.get(primary_label, {})
        display_names = tax_info.get("display_name", {})
        display_name = display_names.get(lang, display_names.get("en", primary_label.replace("_", " ").title()))

        action_templates = tax_info.get("action_template", {})
        raw_action_template = action_templates.get(lang, action_templates.get("en", "Please verify application details."))

        # Populate template variables
        action_text = raw_action_template
        action_text = action_text.replace("{{income_limit}}", rule_failed_details.get("income_limit", "2,50,000"))
        action_text = action_text.replace("{{max_age_days}}", rule_failed_details.get("max_age_days", "365"))
        action_text = action_text.replace("{{document_type}}", rule_failed_details.get("document_type", "Income Certificate"))
        action_text = action_text.replace("{{missing_docs}}", rule_failed_details.get("missing_docs", "required document"))
        action_text = action_text.replace("{{min_age}}", "18").replace("{{max_age}}", "35")

        return {
            "scheme_id": scheme_id,
            "language": lang,
            "primary_failure": {
                "label": primary_label,
                "display_name": display_name,
                "probability": confidence,
                "description": tax_info.get("description", "")
            },
            "secondary_failures": clf_result.get("secondary_failures", []),
            "entities": entities,
            "rule_checks": rule_checks,
            "linked_clauses": linked_clauses,
            "suggested_action": action_text,
            "confidence": confidence,
            "needs_human_review": needs_human_review,
            "models_used": list(set(models_used)),
            "warnings": warnings
        }

_analysis_service = None

def get_analysis_service():
    global _analysis_service
    if _analysis_service is None:
        _analysis_service = AnalysisService()
    return _analysis_service
