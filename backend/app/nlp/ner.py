import re
import yaml

NER_LABELS_PATH = "config/ner_labels.yaml"

class EntityExtractor:
    def __init__(self):
        self.doc_types = [
            "income certificate", "caste certificate", "domicile certificate", "aadhaar",
            "bank passbook", "marksheet", "birth certificate", "ration card", "7/12 extract",
            " non creamy layer", " non-creamy layer", "vending certificate", "आय प्रमाण पत्र",
            "जाति प्रमाण पत्र", "निवास प्रमाण पत्र", "उत्पन्न दाखला", "दाखला"
        ]

    def extract_entities(self, text: str) -> list[dict]:
        if not text:
            return []

        entities = []

        # 1. Income Amounts (e.g. ₹2,50,000, 2.5 Lakh, 250000, Rs 3,00,000, ३,००,०००)
        income_patterns = [
            (r'(?:₹|rs\.?|inr|रु\.?)\s*([0-9,]+(?:\.[0-9]+)?(?:\s*(?:lakh|lac|k))?)', "AMOUNT_INCOME"),
            (r'([0-9,]+\s*(?:lakh|lakhs|lac))', "AMOUNT_INCOME"),
            (r'(?:income|उत्पन्न|आय)\s*[:\-]?\s*(?:₹|rs\.?)?\s*([0-9,]+)', "AMOUNT_INCOME")
        ]
        for pattern, label in income_patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                entities.append({
                    "start": match.start(1),
                    "end": match.end(1),
                    "label": label,
                    "text": match.group(1).strip()
                })

        # 2. Age (e.g. 21 years, 25 वर्ष, age 32)
        age_patterns = [
            (r'(?:age|आयु|वय)\s*[:\-]?\s*(\d{1,3})', "AGE"),
            (r'(\d{1,2})\s*(?:years|yrs|वर्षे|साल|वर्ष)', "AGE")
        ]
        for pattern, label in age_patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                entities.append({
                    "start": match.start(1),
                    "end": match.end(1),
                    "label": label,
                    "text": match.group(1).strip()
                })

        # 3. Document Types
        for dt in self.doc_types:
            for match in re.finditer(re.escape(dt), text, re.IGNORECASE):
                entities.append({
                    "start": match.start(),
                    "end": match.end(),
                    "label": "DOCUMENT_TYPE",
                    "text": match.group()
                })

        # 4. Dates (e.g., 2025-07-10, 10/07/2025, 1 year old)
        date_pattern = r'\b(?:\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{1,2}\s+(?:years?|months?|days?)\s+old)\b'
        for match in re.finditer(date_pattern, text, re.IGNORECASE):
            entities.append({
                "start": match.start(),
                "end": match.end(),
                "label": "DOC_ISSUE_DATE",
                "text": match.group()
            })

        # 5. Categories (SC, ST, OBC, General, EWS)
        cat_pattern = r'\b(SC|ST|OBC|GENERAL|EWS|VJNT|SBC)\b'
        for match in re.finditer(cat_pattern, text, re.IGNORECASE):
            entities.append({
                "start": match.start(),
                "end": match.end(),
                "label": "CATEGORY",
                "text": match.group().upper()
            })

        # Remove duplicate spans
        unique_entities = []
        seen_spans = set()
        for e in entities:
            span_key = (e["start"], e["end"], e["label"])
            if span_key not in seen_spans:
                seen_spans.add(span_key)
                unique_entities.append(e)

        return unique_entities

_ner_instance = None

def get_ner_extractor():
    global _ner_instance
    if _ner_instance is None:
        _ner_instance = EntityExtractor()
    return _ner_instance
