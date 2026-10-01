'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  fetchSchemes,
  analyzeCase,
  extractDocument,
  Scheme,
  AnalyzeResponse,
  DocumentItem
} from '@/lib/api';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  FileText,
  Upload,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RefreshCw,
  Search
} from 'lucide-react';

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const demoParam = searchParams.get('demo');

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('SCH_POST_MATRIC_OBC');
  const [lang, setLang] = useState<string>('en');

  // Case Input Form State
  const [applicantName, setApplicantName] = useState('Priya Patil');
  const [age, setAge] = useState<number>(21);
  const [annualIncome, setAnnualIncome] = useState<number>(320000);
  const [category, setCategory] = useState('OBC');
  const [state, setState] = useState('Maharashtra');
  const [remark, setRemark] = useState('Income proof not valid.');

  // Submitted Documents State
  const [docType, setDocType] = useState('income_certificate');
  const [docIssueDate, setDocIssueDate] = useState('2025-05-10'); // 14 months ago
  const [docList, setDocList] = useState<DocumentItem[]>([
    { type: 'income_certificate', issue_date: '2025-05-10', text: 'Income Certificate issued 14 months ago for ₹3,20,000' },
    { type: 'caste_certificate', issue_date: '2025-01-15', text: 'OBC Caste Certificate' },
    { type: 'non_creamy_layer', issue_date: '2025-04-01', text: 'Valid NCL Certificate' },
    { type: 'domicile_certificate', issue_date: '2024-10-10', text: 'Maharashtra Domicile' },
    { type: 'marksheet', issue_date: '2025-06-01', text: 'Passed Marksheet' },
    { type: 'aadhaar', issue_date: '2022-01-01', text: 'Aadhaar Card' }
  ]);

  // Loading & Result States
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    fetchSchemes({ limit: 50 })
      .then((data) => setSchemes(data.schemes))
      .catch((err) => console.error("Failed to load scheme list", err));

    if (demoParam === 'worked') {
      loadWorkedDemo();
    }
  }, [demoParam]);

  const loadWorkedDemo = () => {
    setSelectedSchemeId('SCH_POST_MATRIC_OBC');
    setApplicantName('Priya Patil');
    setAge(21);
    setAnnualIncome(320000);
    setCategory('OBC');
    setState('Maharashtra');
    setRemark('Income proof not valid.');
    
    // 14 months ago date calculation
    const d = new Date();
    d.setMonth(d.getMonth() - 14);
    const date14MonthsAgo = d.toISOString().split('T')[0];

    setDocList([
      { type: 'income_certificate', issue_date: date14MonthsAgo, text: 'Income Certificate issued 14 months ago for ₹3,20,000' },
      { type: 'caste_certificate', issue_date: '2025-01-15', text: 'OBC Caste Certificate' },
      { type: 'non_creamy_layer', issue_date: '2025-04-01', text: 'Valid NCL Certificate' },
      { type: 'domicile_certificate', issue_date: '2024-10-10', text: 'Maharashtra Domicile' },
      { type: 'marksheet', issue_date: '2025-06-01', text: 'Passed Marksheet' },
      { type: 'aadhaar', issue_date: '2022-01-01', text: 'Aadhaar Card' }
    ]);
  };

  const loadMissingDocDemo = () => {
    setSelectedSchemeId('SCH_POST_MATRIC_SC');
    setApplicantName('Aarav Sharma');
    setAge(20);
    setAnnualIncome(180000);
    setCategory('SC');
    setState('Maharashtra');
    setRemark('Application rejected: caste certificate missing.');
    setDocList([
      { type: 'income_certificate', issue_date: '2026-01-10', text: 'Valid Income Certificate' },
      { type: 'aadhaar', issue_date: '2023-01-01', text: 'Aadhaar Card' },
      { type: 'marksheet', issue_date: '2025-06-01', text: 'Marksheet' }
    ]);
  };

  const loadLadkiBahinDemo = () => {
    setSelectedSchemeId('SCH_MAJHI_LADKI_BAHIN');
    setApplicantName('Sunita Deshmukh');
    setAge(28);
    setAnnualIncome(200000);
    setCategory('General');
    setState('Gujarat');
    setRemark('Applicant is not a permanent resident of Maharashtra.');
    setDocList([
      { type: 'aadhaar', issue_date: '2022-01-01', text: 'Aadhaar Card' },
      { type: 'income_certificate', issue_date: '2026-02-01', text: 'Income Certificate' },
      { type: 'bank_passbook', issue_date: '2024-01-01', text: 'Bank Passbook' }
    ]);
  };

  const handleAddDocument = () => {
    if (!docType) return;
    setDocList([...docList, { type: docType, issue_date: docIssueDate, text: `${docType.replace('_', ' ')} issued ${docIssueDate}` }]);
  };

  const handleRemoveDocument = (index: number) => {
    setDocList(docList.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    try {
      const extResult = await extractDocument(file);
      setDocList([
        ...docList,
        {
          type: file.name.toLowerCase().includes('income') ? 'income_certificate' : 'uploaded_document',
          issue_date: new Date().toISOString().split('T')[0],
          text: extResult.full_text
        }
      ]);
    } catch (err: any) {
      alert("Failed to extract document: " + err.message);
    } finally {
      setExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const payload = {
        scheme_id: selectedSchemeId === 'DETECT_AUTO' ? null : selectedSchemeId,
        language: lang,
        case: {
          applicant: {
            name: applicantName,
            age: Number(age),
            annual_income: Number(annualIncome),
            category: category,
            state: state
          },
          documents: docList
        },
        remark: remark
      };

      const data = await analyzeCase(payload);
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to analyze case. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      
      {/* Title & Prefill Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-emerald-500" />
            <span>Application Rejection Analyzer</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Input scheme details, applicant information, and rejection remark to generate evidence-backed diagnosis.
          </p>
        </div>

        {/* Demo Prefill Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadWorkedDemo}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acceptance Demo Case (Income & Expired)</span>
          </button>

          <button
            onClick={loadMissingDocDemo}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            Missing Doc Case
          </button>

          <button
            onClick={loadLadkiBahinDemo}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            Domicile Case
          </button>
        </div>
      </div>

      {/* Grid: Inputs (Left) and Results (Right) */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Step 1: Scheme Selection */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Step 1. Target Scheme
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="DETECT_AUTO">🔍 Auto-Detect Scheme from Remark</option>
              {schemes.map((s) => (
                <option key={s.scheme_id} value={s.scheme_id}>
                  {s.name} ({s.level} - {s.state})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Applicant Case Details */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Step 2. Applicant Profile & Remark
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Applicant Name</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Annual Income (₹)</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                >
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="General">General</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">State of Domicile</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
            </div>

            {/* Rejection Remark Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Rejection Remark / Remark Text
              </label>
              <textarea
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="e.g. Income proof not valid. Certificate expired."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* Submitted Documents Section */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Submitted Documents & Issue Dates
              </label>

              <div className="flex gap-2">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                >
                  <option value="income_certificate">Income Certificate</option>
                  <option value="caste_certificate">Caste Certificate</option>
                  <option value="non_creamy_layer">Non-Creamy Layer</option>
                  <option value="domicile_certificate">Domicile Certificate</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="marksheet">Marksheet</option>
                  <option value="bank_passbook">Bank Passbook</option>
                  <option value="birth_certificate">Birth Certificate</option>
                </select>

                <input
                  type="date"
                  value={docIssueDate}
                  onChange={(e) => setDocIssueDate(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />

                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
                >
                  + Add
                </button>
              </div>

              {/* Upload File button */}
              <div className="flex items-center gap-2 pt-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>{extracting ? 'Extracting...' : 'Upload Doc (PDF/DOCX/TXT)'}</span>
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Document Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {docList.map((doc, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                    <FileText className="w-3 h-3 text-emerald-500" />
                    <span>{doc.type.replace('_', ' ')} ({doc.issue_date || 'No Date'})</span>
                    <button onClick={() => handleRemoveDocument(idx)} className="text-slate-400 hover:text-red-500 font-bold ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{loading ? 'Running Rule Engine & Hybrid Retrieval...' : 'Analyze Rejection & Find Evidence'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Output Diagnosis */}
        <div className="lg:col-span-7 space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3">
              <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <strong>Analysis Failed:</strong> {errorMsg}
              </div>
            </div>
          )}

          {!result && !loading && !errorMsg && (
            <div className="glass-card p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Ready to Analyze Application</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Click <strong>"Try Acceptance Demo Case"</strong> above or fill in the details on the left to generate evidence-backed failure explanation.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Human Review Banner */}
              {result.needs_human_review && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Flagged for Human Review:</strong> Confidence is below 0.65 or deterministic checks require verification by a scheme officer.
                  </div>
                </div>
              )}

              {/* Primary Failure Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Diagnosed Primary Failure</span>
                    <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                      {result.primary_failure.display_name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{result.primary_failure.description}</p>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold border border-emerald-300 dark:border-emerald-800">
                      {Math.round(result.confidence * 100)}% Confidence
                    </span>
                  </div>
                </div>

                {/* Suggested Action Card */}
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Suggested Corrective Action</span>
                  </div>
                  <p className="text-sm font-medium text-emerald-950 dark:text-emerald-100">
                    {result.suggested_action}
                  </p>
                </div>
              </div>

              {/* Deterministic Rule Check Table */}
              {result.rule_checks && result.rule_checks.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-emerald-500" />
                    <span>Deterministic Scheme Rule Checks</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <tr>
                          <th className="p-2.5 rounded-l-lg">Rule ID & Description</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Expected Threshold</th>
                          <th className="p-2.5 rounded-r-lg">Actual Applicant Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {result.rule_checks.map((rc, idx) => (
                          <tr key={idx} className={rc.passed ? 'hover:bg-slate-50/50' : 'bg-rose-50/40 dark:bg-rose-950/20'}>
                            <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">
                              <div className="font-mono text-slate-500 text-[11px]">{rc.rule_id}</div>
                              <div>{rc.description}</div>
                            </td>
                            <td className="p-2.5">
                              {rc.passed ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                                  <CheckCircle2 className="w-3 h-3" /> PASS
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                                  <XCircle className="w-3 h-3" /> FAIL
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">{rc.expected}</td>
                            <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-slate-100">{rc.actual}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Evidence Panel: Linked Clauses */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>Retrieved Scheme Clause Evidence</span>
                  </span>
                  <span className="text-xs text-slate-400 font-normal">Ranked by BGE-M3 + BM25 RRF Score</span>
                </h3>

                {result.linked_clauses.length === 0 ? (
                  <p className="text-xs text-slate-500">No matching clauses retrieved for this scheme.</p>
                ) : (
                  <div className="space-y-3">
                    {result.linked_clauses.map((clause, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200 font-bold">
                            {clause.clause_id} ({clause.section})
                          </span>
                          {clause.source_url && (
                            <a
                              href={clause.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              <span>Official Scheme Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                          "{clause.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expandable Technical Details */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
                <button
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                >
                  {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{showTechnicalDetails ? 'Hide' : 'Show'} Extracted Entities & Execution Pipeline</span>
                </button>

                {showTechnicalDetails && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-3">
                    <div>
                      <span className="text-emerald-400 font-bold">Models & Engines Executed:</span>
                      <p>{result.models_used.join(', ')}</p>
                    </div>

                    <div>
                      <span className="text-emerald-400 font-bold">Extracted Entities (NER Spans):</span>
                      {result.entities.length === 0 ? (
                        <p className="text-slate-400">None extracted.</p>
                      ) : (
                        <ul className="list-disc pl-4 space-y-0.5">
                          {result.entities.map((e, idx) => (
                            <li key={idx}>[{e.label}] "{e.text}"</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
