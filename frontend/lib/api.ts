// Typed API Client for EntitleTrace FastAPI Backend

export interface Applicant {
  name?: string;
  age?: number;
  annual_income?: number;
  category?: string;
  state?: string;
}

export interface DocumentItem {
  type: string;
  issue_date?: string;
  valid_till?: string;
  text?: string;
}

export interface CaseInput {
  applicant: Applicant;
  documents: DocumentItem[];
  form_text?: string;
}

export interface AnalyzeRequest {
  scheme_id?: string | null;
  language?: string;
  case: CaseInput;
  remark: string;
}

export interface PrimaryFailure {
  label: string;
  display_name: string;
  probability: number;
  description?: string;
}

export interface SecondaryFailure {
  label: string;
  probability: number;
}

export interface EntityItem {
  start: number;
  end: number;
  label: string;
  text: string;
}

export interface RuleCheck {
  rule_id: string;
  type: string;
  passed: boolean;
  expected: string;
  actual: string;
  clause_ref?: string;
  description?: string;
  missing_documents?: string[];
}

export interface LinkedClause {
  clause_id: string;
  scheme_id: string;
  scheme_name: string;
  section: string;
  text: string;
  score: number;
  source_url?: string;
}

export interface AnalyzeResponse {
  scheme_id?: string;
  language: string;
  primary_failure: PrimaryFailure;
  secondary_failures: SecondaryFailure[];
  entities: EntityItem[];
  rule_checks: RuleCheck[];
  linked_clauses: LinkedClause[];
  suggested_action: string;
  confidence: number;
  needs_human_review: boolean;
  models_used: string[];
  warnings: string[];
}

export interface Scheme {
  scheme_id: string;
  name: string;
  short_name?: string;
  scheme_short_name?: string;
  level: string;
  state: string;
  ministry_name?: string;
  nodal_agency?: string;
  categories?: string;
  target_group?: string;
  benefit_type?: string;
  details?: string;
  benefits?: string;
  eligibility?: string;
  application_process?: string;
  documents_required?: string;
  faqs?: string;
  source_url?: string;
  tags?: string;
  gender_eligibility?: string;
  min_age?: number;
  max_age?: number;
  max_income?: number;
  clauses?: LinkedClause[];
  [key: string]: any;
}

export interface FailureAnalytics {
  total_cases: number;
  by_failure_type: Record<string, number>;
  by_language: Record<string, number>;
  by_scheme: Record<string, number>;
}

export interface TopicItem {
  topic_id: number;
  title: string;
  top_terms: string[];
  sample_remarks: string[];
  associated_schemes: string[];
  weight_pct: number;
}

export interface TopicAnalytics {
  total_topics: number;
  topics: TopicItem[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://entitletrace.onrender.com';
const API_BASE = typeof window === 'undefined' ? `${BACKEND_URL}/v1` : '/api/v1';


export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Backend offline");
  return res.json();
}

import { FALLBACK_SCHEMES } from './fallbackSchemes';

export async function fetchSchemes(params?: { q?: string; level?: string; state?: string; category?: string; limit?: number; offset?: number }) {
  const query = new URLSearchParams();
  if (params?.q) query.append("q", params.q);
  if (params?.level) query.append("level", params.level);
  if (params?.state) query.append("state", params.state);
  if (params?.category) query.append("category", params.category);
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.offset) query.append("offset", params.offset.toString());

  try {
    const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
    if (res.ok) {
      return await res.json() as { total: number; limit: number; offset: number; schemes: Scheme[] };
    }
  } catch (e) {
    console.warn("fetchSchemes remote failed, using local offline schemes", e);
  }

  // Resilient fallback so schemes tab is NEVER empty even if backend is offline
  let filtered = [...FALLBACK_SCHEMES];
  if (params?.level) {
    filtered = filtered.filter(s => s.level.toLowerCase() === params.level?.toLowerCase());
  }
  if (params?.state) {
    filtered = filtered.filter(s => s.state.toLowerCase().includes(params.state!.toLowerCase()));
  }
  if (params?.category) {
    filtered = filtered.filter(s => (s.categories || '').toLowerCase().includes(params.category!.toLowerCase()));
  }
  if (params?.q) {
    const qL = params.q.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(qL) ||
      (s.details || '').toLowerCase().includes(qL) ||
      (s.eligibility || '').toLowerCase().includes(qL)
    );
  }
  const offset = params?.offset || 0;
  const limit = params?.limit || 50;
  return {
    total: filtered.length,
    limit,
    offset,
    schemes: filtered.slice(offset, offset + limit)
  };
}

export async function fetchSchemeDetail(schemeId: string) {
  try {
    const res = await fetch(`${API_BASE}/schemes/${schemeId}`);
    if (res.ok) {
      return await res.json() as Scheme;
    }
  } catch (e) {
    console.warn(`fetchSchemeDetail remote failed for ${schemeId}, using fallback`, e);
  }

  const match = FALLBACK_SCHEMES.find(s => s.scheme_id === schemeId);
  if (match) return match;
  throw new Error(`Scheme ${schemeId} not found`);
}

export async function analyzeCase(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Backend connection error. Please make sure the EntitleTrace backend is reachable." }));
    throw new Error(err.detail || "Analysis failed");
  }
  return res.json();
}

export async function extractDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/extract`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Document extraction failed");
  return res.json();
}

export async function fetchFailureAnalytics(): Promise<FailureAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/failures`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function fetchTopicAnalytics(): Promise<TopicAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/topics`);
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
}

export async function fetchTaxonomy() {
  const res = await fetch(`${API_BASE}/taxonomy`);
  if (!res.ok) throw new Error("Failed to fetch taxonomy");
  return res.json();
}
