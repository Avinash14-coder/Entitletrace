from fastapi import APIRouter
import yaml
import os

from backend.app.core.paths import get_path

router = APIRouter(prefix="/v1/taxonomy", tags=["Taxonomy"])
TAXONOMY_PATH = "config/taxonomy.yaml"

@router.get("")
def get_taxonomy():
    tax_file = get_path(TAXONOMY_PATH)
    if os.path.exists(tax_file):
        with open(tax_file, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data.get("taxonomies", {})
    return {}
