from fastapi import APIRouter, HTTPException, Query
import pandas as pd
import os
import json

router = APIRouter(prefix="/v1/schemes", tags=["Schemes"])
SCHEMES_PARQUET = "data/processed/schemes.parquet"
CLAUSES_PARQUET = "data/processed/clauses.parquet"

@router.get("")
def list_schemes(
    q: str = Query(None, description="Search query"),
    level: str = Query(None, description="Central or State"),
    state: str = Query(None, description="Filter by state name"),
    category: str = Query(None, description="Filter by category"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    if not os.path.exists(SCHEMES_PARQUET):
        raise HTTPException(status_code=500, detail="Schemes dataset not loaded.")

    df = pd.read_parquet(SCHEMES_PARQUET)

    if level:
        df = df[df["level"].str.lower() == level.lower()]
    if state:
        df = df[df["state"].str.lower().str.contains(state.lower())]
    if category:
        df = df[df["categories"].str.lower().str.contains(category.lower())]
    if q:
        q_lower = q.lower()
        df = df[
            df["name"].str.lower().str.contains(q_lower) |
            df["details"].str.lower().str.contains(q_lower) |
            df["eligibility"].str.lower().str.contains(q_lower)
        ]

    total = len(df)
    paged = df.iloc[offset:offset+limit].to_dict(orient="records")

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "schemes": paged
    }

@router.get("/{scheme_id}")
def get_scheme_detail(scheme_id: str):
    if not os.path.exists(SCHEMES_PARQUET):
        raise HTTPException(status_code=500, detail="Schemes dataset not loaded.")

    df_schemes = pd.read_parquet(SCHEMES_PARQUET)
    match = df_schemes[df_schemes["scheme_id"] == scheme_id]
    if match.empty:
        raise HTTPException(status_code=404, detail=f"Scheme with ID '{scheme_id}' not found.")

    scheme_data = match.iloc[0].to_dict()

    # Load associated clauses
    clauses = []
    if os.path.exists(CLAUSES_PARQUET):
        df_clauses = pd.read_parquet(CLAUSES_PARQUET)
        c_matches = df_clauses[df_clauses["scheme_id"] == scheme_id]
        clauses = c_matches.to_dict(orient="records")

    scheme_data["clauses"] = clauses
    return scheme_data
