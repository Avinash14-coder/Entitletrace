from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ApplicantSchema(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    annual_income: Optional[float] = None
    category: Optional[str] = None
    state: Optional[str] = None

class DocumentSchema(BaseModel):
    type: str
    issue_date: Optional[str] = None
    valid_till: Optional[str] = None
    text: Optional[str] = None

class CaseInputSchema(BaseModel):
    applicant: ApplicantSchema
    documents: List[DocumentSchema] = []
    form_text: Optional[str] = None

class AnalyzeRequestSchema(BaseModel):
    scheme_id: Optional[str] = None
    language: str = "auto"  # en | hi | mr | auto
    case: CaseInputSchema
    remark: str

class PrimaryFailureSchema(BaseModel):
    label: str
    display_name: str
    probability: float
    description: Optional[str] = ""

class RuleCheckSchema(BaseModel):
    rule_id: str
    type: str
    passed: bool
    expected: str
    actual: str
    clause_ref: Optional[str] = None
    description: Optional[str] = None
    missing_documents: Optional[List[str]] = None

class LinkedClauseSchema(BaseModel):
    clause_id: str
    scheme_id: str
    scheme_name: str
    section: str
    text: str
    score: float
    source_url: Optional[str] = None

class EntitySchema(BaseModel):
    start: int
    end: int
    label: str
    text: str

class AnalyzeResponseSchema(BaseModel):
    scheme_id: Optional[str] = None
    language: str
    primary_failure: PrimaryFailureSchema
    secondary_failures: List[Dict[str, Any]] = []
    entities: List[EntitySchema] = []
    rule_checks: List[RuleCheckSchema] = []
    linked_clauses: List[LinkedClauseSchema] = []
    suggested_action: str
    confidence: float
    needs_human_review: bool
    models_used: List[str] = []
    warnings: List[str] = []

class ExtractResponseSchema(BaseModel):
    filename: str
    extension: str
    total_pages: int
    pages: List[Dict[str, Any]]
    full_text: str
    warnings: List[str] = []
