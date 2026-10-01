from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from backend.app.api.schemes import router as schemes_router
from backend.app.api.analyze import router as analyze_router
from backend.app.api.extract import router as extract_router
from backend.app.api.analytics import router as analytics_router
from backend.app.api.taxonomy import router as taxonomy_router

app = FastAPI(
    title="EntitleTrace NLP API",
    description="Explanation and diagnosis aid for government welfare scheme application rejections.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(schemes_router)
app.include_router(analyze_router)
app.include_router(extract_router)
app.include_router(analytics_router)
app.include_router(taxonomy_router)

@app.get("/v1/health", tags=["Health"])
def health_check():
    index_exists = os.path.exists("data/index/bm25.pkl")
    schemes_exist = os.path.exists("data/processed/schemes.parquet")
    
    return {
        "status": "ok",
        "app_name": "EntitleTrace",
        "version": "1.0.0",
        "models_loaded": ["rule_engine_v1", "tfidf_logistic_regression", "regex_gazetteer_ner"],
        "index_loaded": index_exists,
        "database_ready": schemes_exist
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
