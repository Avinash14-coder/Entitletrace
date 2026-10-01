from fastapi import APIRouter, File, UploadFile, HTTPException
from backend.app.core.schemas import ExtractResponseSchema
from backend.app.ingestion.document_reader import extract_text_from_file

router = APIRouter(prefix="/v1/extract", tags=["Document Extraction"])

@router.post("", response_model=ExtractResponseSchema)
async def extract_document_text(file: UploadFile = File(...)):
    try:
        content = await file.read()
        res = extract_text_from_file(content, file.filename)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document upload: {str(e)}")
