from fastapi import APIRouter
import yaml
import os

router = APIRouter(prefix="/v1/taxonomy", tags=["Taxonomy"])
TAXONOMY_PATH = "config/taxonomy.yaml"

@router.get("")
def get_taxonomy():
    if os.path.exists(TAXONOMY_PATH):
        with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data.get("taxonomies", {})
    return {}
