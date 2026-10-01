from fastapi import APIRouter
import os
import json
import pandas as pd
from backend.app.nlp.topics import extract_topics

router = APIRouter(prefix="/v1/analytics", tags=["Analytics"])
SYNTHETIC_CASES_PATH = "data/synthetic/cases.jsonl"

@router.get("/failures")
def get_failure_analytics():
    if not os.path.exists(SYNTHETIC_CASES_PATH):
        return {"total_cases": 0, "by_failure_type": {}, "by_language": {}, "by_scheme": {}}

    failures = {}
    languages = {}
    schemes = {}
    total = 0

    with open(SYNTHETIC_CASES_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                item = json.loads(line)
                total += 1
                
                ftype = item.get("primary_failure", "unknown")
                failures[ftype] = failures.get(ftype, 0) + 1

                lang = item.get("language", "en")
                languages[lang] = languages.get(lang, 0) + 1

                sname = item.get("scheme_name", "Unknown Scheme")
                schemes[sname] = schemes.get(sname, 0) + 1

    return {
        "total_cases": total,
        "by_failure_type": failures,
        "by_language": languages,
        "by_scheme": schemes
    }

@router.get("/topics")
def get_topic_analytics():
    topics = extract_topics(num_topics=5)
    return {
        "total_topics": len(topics),
        "topics": topics
    }
