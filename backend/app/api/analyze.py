from fastapi import APIRouter, HTTPException
from backend.app.core.schemas import AnalyzeRequestSchema, AnalyzeResponseSchema
from backend.app.services.analyze_case import get_analysis_service

router = APIRouter(prefix="/v1/analyze", tags=["Analyze"])

@router.post("", response_model=AnalyzeResponseSchema)
def analyze_case_endpoint(payload: AnalyzeRequestSchema):
    try:
        service = get_analysis_service()
        case_dict = payload.case.model_dump()
        result = service.analyze(
            scheme_id=payload.scheme_id,
            case_data=case_dict,
            remark_text=payload.remark,
            language_hint=payload.language
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Case analysis failed: {str(e)}")
