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
  Search,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Calendar,
  FilePlus,
  Info,
  RotateCcw
} from 'lucide-react';

// Required documents mapping per scheme
const SCHEME_DOCUMENTS_MAP: Record<string, { name: string; docs: { type: string; label: string; issueDateRequired?: boolean }[] }> = {
  'SCH_POST_MATRIC_OBC': {
    name: 'Post Matric Scholarship for OBC Students',
    docs: [
      { type: 'income_certificate', label: 'Income Certificate (≤ ₹1.5 Lakh/yr)', issueDateRequired: true },
      { type: 'caste_certificate', label: 'OBC Caste Certificate', issueDateRequired: false },
      { type: 'non_creamy_layer', label: 'Non-Creamy Layer Certificate', issueDateRequired: true },
      { type: 'domicile_certificate', label: 'Maharashtra Domicile Certificate', issueDateRequired: false },
      { type: 'marksheet', label: 'Previous Year Marksheet', issueDateRequired: false },
      { type: 'aadhaar', label: 'Aadhaar Card', issueDateRequired: false }
    ]
  },
  'SCH_POST_MATRIC_SC': {
    name: 'Post Matric Scholarship for SC Students',
    docs: [
      { type: 'income_certificate', label: 'Income Certificate (≤ ₹2.5 Lakh/yr)', issueDateRequired: true },
      { type: 'caste_certificate', label: 'SC Caste Certificate', issueDateRequired: false },
      { type: 'aadhaar', label: 'Aadhaar Card', issueDateRequired: false },
      { type: 'marksheet', label: 'Class 10/12 Marksheet', issueDateRequired: false },
      { type: 'bank_passbook', label: 'Aadhaar Seeded Bank Passbook', issueDateRequired: false }
    ]
  },
  'SCH_MAJHI_LADKI_BAHIN': {
    name: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    docs: [
      { type: 'aadhaar', label: 'Aadhaar Card', issueDateRequired: false },
      { type: 'domicile_certificate', label: 'Maharashtra Domicile Certificate / Birth Cert', issueDateRequired: false },
      { type: 'income_certificate', label: 'Income Certificate / Yellow-Orange Ration Card', issueDateRequired: true },
      { type: 'bank_passbook', label: 'Bank Passbook (Direct Benefit Transfer)', issueDateRequired: false }
    ]
  },
  'SCH_PMAY_URBAN': {
    name: 'Pradhan Mantri Awas Yojana - Urban',
    docs: [
      { type: 'income_certificate', label: 'EWS Income Certificate (≤ ₹3 Lakh/yr)', issueDateRequired: true },
      { type: 'aadhaar', label: 'Family Aadhaar Cards', issueDateRequired: false },
      { type: 'domicile_certificate', label: 'Urban Domicile Proof', issueDateRequired: false },
      { type: 'land_ownership_proof', label: 'Land Ownership Document / Title Deed', issueDateRequired: false },
      { type: 'no_pucca_house_affidavit', label: 'No Pucca House Affidavit', issueDateRequired: false }
    ]
  },
  'SCH_NMMS': {
    name: 'National Means-cum-Merit Scholarship Scheme',
    docs: [
      { type: 'marksheet', label: 'Class 7 Marksheet (Min 55% marks)', issueDateRequired: false },
      { type: 'income_certificate', label: 'Parental Income Certificate (≤ ₹3.5 Lakh/yr)', issueDateRequired: true },
      { type: 'aadhaar', label: 'Student Aadhaar Card', issueDateRequired: false },
      { type: 'bank_passbook', label: 'Student Bank Passbook', issueDateRequired: false }
    ]
  },
  'SCH_PM_KISAN': {
    name: 'PM Kisan Samman Nidhi',
    docs: [
      { type: 'land_record', label: 'Land Ownership Record (7/12 / Khatauni Extract)', issueDateRequired: false },
      { type: 'aadhaar', label: 'Farmer Aadhaar Card', issueDateRequired: false },
      { type: 'bank_passbook', label: 'Aadhaar Seeded Bank Account Details', issueDateRequired: false }
    ]
  },
  'SCH_KANYA_SUMANGALA': {
    name: 'Mukhyamantri Kanya Sumangala Yojana',
    docs: [
      { type: 'birth_certificate', label: 'Girl Child Birth Certificate', issueDateRequired: false },
      { type: 'domicile_certificate', label: 'UP Domicile Certificate', issueDateRequired: false },
      { type: 'income_certificate', label: 'Family Income Certificate (≤ ₹3 Lakh/yr)', issueDateRequired: true },
      { type: 'aadhaar', label: 'Parent Aadhaar Card', issueDateRequired: false },
      { type: 'bank_passbook', label: 'Bank Passbook', issueDateRequired: false }
    ]
  },
  'SCH_PM_SVANIDHI': {
    name: "PM Street Vendor's AtmaNirbhar Nidhi",
    docs: [
      { type: 'vending_certificate', label: 'Certificate of Vending / Letter of Recommendation (LoR)', issueDateRequired: false },
      { type: 'aadhaar', label: 'Vendor Aadhaar Card', issueDateRequired: false },
      { type: 'bank_passbook', label: 'Bank Account Passbook', issueDateRequired: false }
    ]
  }
};

const ALL_DOC_OPTIONS = [
  { type: 'income_certificate', label: 'Income Certificate' },
  { type: 'caste_certificate', label: 'Caste Certificate' },
  { type: 'non_creamy_layer', label: 'Non-Creamy Layer Certificate' },
  { type: 'domicile_certificate', label: 'Domicile Certificate' },
  { type: 'aadhaar', label: 'Aadhaar Card' },
  { type: 'marksheet', label: 'Marksheet' },
  { type: 'bank_passbook', label: 'Bank Passbook' },
  { type: 'birth_certificate', label: 'Birth Certificate' },
  { type: 'land_record', label: 'Land Record (7/12 Extract)' },
  { type: 'vending_certificate', label: 'Vending Certificate / LoR' },
  { type: 'uploaded_document', label: 'Other Document' }
];

interface ManagedDocItem {
  type: string;
  label: string;
  submitted: boolean;
  issue_date: string;
  isSchemeRequired: boolean;
  text?: string;
}

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const demoParam = searchParams.get('demo');
  const modeParam = searchParams.get('mode');

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('SCH_POST_MATRIC_OBC');
  const [lang, setLang] = useState<string>('en');

  // Case Input Form State
  const [applicantName, setApplicantName] = useState('');
  const [age, setAge] = useState<number>(21);
  const [annualIncome, setAnnualIncome] = useState<number>(0);
  const [category, setCategory] = useState('OBC');
  const [state, setState] = useState('');
  const [remark, setRemark] = useState('');

  // Managed Document List State
  const [managedDocs, setManagedDocs] = useState<ManagedDocItem[]>([]);
  
  // Add Extra Document state
  const [newDocType, setNewDocType] = useState('birth_certificate');
  const [newDocIssueDate, setNewDocIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Loading & Result States
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Load Scheme List and set mode
  useEffect(() => {
    fetchSchemes({ limit: 50 })
      .then((data) => setSchemes(data.schemes))
      .catch((err) => console.error("Failed to load scheme list", err));

    if (demoParam === 'worked') {
      loadWorkedDemo();
    } else if (demoParam === 'missing') {
      loadMissingDocDemo();
    } else if (demoParam === 'domicile') {
      loadLadkiBahinDemo();
    } else {
      loadFreshCustomForm();
    }
  }, [demoParam, modeParam]);

  // When selected scheme changes, update document requirements list
  const handleSchemeChange = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    syncDocsForScheme(schemeId);
  };

  const syncDocsForScheme = (schemeId: string, customDates?: Record<string, string>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const mapInfo = SCHEME_DOCUMENTS_MAP[schemeId];
    
    let requiredDocs: { type: string; label: string }[] = [];
    if (mapInfo) {
      requiredDocs = mapInfo.docs;
    } else {
      // Default fallback if scheme is auto-detect or unknown
      requiredDocs = [
        { type: 'income_certificate', label: 'Income Certificate' },
        { type: 'caste_certificate', label: 'Caste Certificate' },
        { type: 'domicile_certificate', label: 'Domicile Certificate' },
        { type: 'aadhaar', label: 'Aadhaar Card' }
      ];
    }

    const initialDocs: ManagedDocItem[] = requiredDocs.map((d) => ({
      type: d.type,
      label: d.label,
      submitted: true,
      issue_date: customDates?.[d.type] || todayStr,
      isSchemeRequired: true
    }));

    setManagedDocs(initialDocs);
    setDuplicateWarning(null);
  };

  // Clean Custom Form Loader
  const loadFreshCustomForm = () => {
    setSelectedSchemeId('SCH_POST_MATRIC_OBC');
    setApplicantName('');
    setAge(21);
    setAnnualIncome(0);
    setCategory('OBC');
    setState('');
    setRemark('');
    setResult(null);
    setErrorMsg(null);
    syncDocsForScheme('SCH_POST_MATRIC_OBC');
  };

  // Demo Loaders
  const loadWorkedDemo = () => {
    setSelectedSchemeId('SCH_POST_MATRIC_OBC');
    setApplicantName('Priya Patil');
    setAge(21);
    setAnnualIncome(320000);
    setCategory('OBC');
    setState('Maharashtra');
    setRemark('Income proof not valid.');

    // 14 months ago date calculation (~420 days ago)
    const d = new Date();
    d.setMonth(d.getMonth() - 14);
    const date14MonthsAgo = d.toISOString().split('T')[0];

    setManagedDocs([
      { type: 'income_certificate', label: 'Income Certificate (≤ ₹1.5 Lakh/yr)', submitted: true, issue_date: date14MonthsAgo, isSchemeRequired: true, text: 'Income Certificate issued 14 months ago for ₹3,20,000' },
      { type: 'caste_certificate', label: 'OBC Caste Certificate', submitted: true, issue_date: '2025-01-15', isSchemeRequired: true },
      { type: 'non_creamy_layer', label: 'Non-Creamy Layer Certificate', submitted: true, issue_date: '2025-04-01', isSchemeRequired: true },
      { type: 'domicile_certificate', label: 'Maharashtra Domicile Certificate', submitted: true, issue_date: '2024-10-10', isSchemeRequired: true },
      { type: 'marksheet', label: 'Previous Year Marksheet', submitted: true, issue_date: '2025-06-01', isSchemeRequired: true },
      { type: 'aadhaar', label: 'Aadhaar Card', submitted: true, issue_date: '2022-01-01', isSchemeRequired: true }
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

    setManagedDocs([
      { type: 'income_certificate', label: 'Income Certificate (≤ ₹2.5 Lakh/yr)', submitted: true, issue_date: '2026-01-10', isSchemeRequired: true },
      { type: 'caste_certificate', label: 'SC Caste Certificate', submitted: false, issue_date: '', isSchemeRequired: true },
      { type: 'aadhaar', label: 'Aadhaar Card', submitted: true, issue_date: '2023-01-01', isSchemeRequired: true },
      { type: 'marksheet', label: 'Class 10/12 Marksheet', submitted: true, issue_date: '2025-06-01', isSchemeRequired: true },
      { type: 'bank_passbook', label: 'Aadhaar Seeded Bank Passbook', submitted: false, issue_date: '', isSchemeRequired: true }
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

    setManagedDocs([
      { type: 'aadhaar', label: 'Aadhaar Card', submitted: true, issue_date: '2022-01-01', isSchemeRequired: true },
      { type: 'domicile_certificate', label: 'Maharashtra Domicile Certificate / Birth Cert', submitted: true, issue_date: '2024-05-10', isSchemeRequired: true },
      { type: 'income_certificate', label: 'Income Certificate / Yellow-Orange Ration Card', submitted: true, issue_date: '2026-02-01', isSchemeRequired: true },
      { type: 'bank_passbook', label: 'Bank Passbook (Direct Benefit Transfer)', submitted: true, issue_date: '2024-01-01', isSchemeRequired: true }
    ]);
  };

  // Document Checklist Actions
  const toggleDocSubmitted = (index: number) => {
    const updated = [...managedDocs];
    updated[index].submitted = !updated[index].submitted;
    setManagedDocs(updated);
  };

  const updateDocIssueDate = (index: number, newDate: string) => {
    const updated = [...managedDocs];
    updated[index].issue_date = newDate;
    setManagedDocs(updated);
  };

  const handleAddExtraDocument = () => {
    setDuplicateWarning(null);

    // Check if docType already exists in managedDocs list
    const exists = managedDocs.some((d) => d.type === newDocType);
    if (exists) {
      const docObj = ALL_DOC_OPTIONS.find((opt) => opt.type === newDocType);
      const name = docObj ? docObj.label : newDocType.replace(/_/g, ' ');
      setDuplicateWarning(`"${name}" is already in your document checklist below! You can toggle its status or update its date directly.`);
      return;
    }

    const docObj = ALL_DOC_OPTIONS.find((opt) => opt.type === newDocType);
    const label = docObj ? docObj.label : newDocType.replace(/_/g, ' ');

    setManagedDocs([
      ...managedDocs,
      {
        type: newDocType,
        label: label,
        submitted: true,
        issue_date: newDocIssueDate || new Date().toISOString().split('T')[0],
        isSchemeRequired: false
      }
    ]);
  };

  const handleRemoveDoc = (index: number) => {
    setManagedDocs(managedDocs.filter((_, i) => i !== index));
    setDuplicateWarning(null);
  };

  // Upload File handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetDocIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    try {
      const extResult = await extractDocument(file);
      
      if (targetDocIndex !== undefined && targetDocIndex >= 0 && targetDocIndex < managedDocs.length) {
        // Attach text to specific document line
        const updated = [...managedDocs];
        updated[targetDocIndex].submitted = true;
        updated[targetDocIndex].text = extResult.full_text;
        setManagedDocs(updated);
      } else {
        // Find best match or add as new uploaded document
        const fname = file.name.toLowerCase();
        let matchedType = 'uploaded_document';
        if (fname.includes('income')) matchedType = 'income_certificate';
        else if (fname.includes('caste')) matchedType = 'caste_certificate';
        else if (fname.includes('domicile')) matchedType = 'domicile_certificate';
        else if (fname.includes('marksheet')) matchedType = 'marksheet';
        else if (fname.includes('aadhaar')) matchedType = 'aadhaar';

        const existingIdx = managedDocs.findIndex((d) => d.type === matchedType);
        if (existingIdx >= 0) {
          const updated = [...managedDocs];
          updated[existingIdx].submitted = true;
          updated[existingIdx].text = extResult.full_text;
          setManagedDocs(updated);
        } else {
          setManagedDocs([
            ...managedDocs,
            {
              type: matchedType,
              label: file.name,
              submitted: true,
              issue_date: new Date().toISOString().split('T')[0],
              isSchemeRequired: false,
              text: extResult.full_text
            }
          ]);
        }
      }
    } catch (err: any) {
      alert("Failed to extract document: " + err.message);
    } finally {
      setExtracting(false);
    }
  };

  // Handle Submit Analysis
  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    // Filter only submitted documents for backend submission
    const submittedDocuments: DocumentItem[] = managedDocs
      .filter((d) => d.submitted)
      .map((d) => ({
        type: d.type,
        issue_date: d.issue_date || undefined,
        text: d.text || `${d.label} submitted`
      }));

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
          documents: submittedDocuments
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

  const selectedSchemeObj = SCHEME_DOCUMENTS_MAP[selectedSchemeId];

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

        {/* Demo Prefill & Reset Bar */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadFreshCustomForm}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
            <span>Clear / Custom Form</span>
          </button>

          <button
            onClick={loadWorkedDemo}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Case (Income & Expired)</span>
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
              onChange={(e) => handleSchemeChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="DETECT_AUTO">🔍 Auto-Detect Scheme from Remark</option>
              {schemes.map((s) => (
                <option key={s.scheme_id} value={s.scheme_id}>
                  {s.name} ({s.level} - {s.state})
                </option>
              ))}
            </select>
            {selectedSchemeObj && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Dynamic document checklist loaded for {selectedSchemeObj.name}
              </p>
            )}
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
                  placeholder="e.g. Avinash Pawar"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={age || ''}
                  onChange={(e) => setAge(Number(e.target.value))}
                  placeholder="e.g. 21"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Annual Income (₹)</label>
                <input
                  type="number"
                  value={annualIncome || ''}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  placeholder="e.g. 180000"
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
                  placeholder="e.g. Maharashtra"
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

            {/* Step 3: Scheme Documents Checklist */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Step 3. Scheme Documents Checklist
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {managedDocs.filter(d => d.submitted).length} of {managedDocs.length} Submitted
                </span>
              </div>

              {/* Explanatory Info Banner */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-800 dark:text-blue-300">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span>How to verify documents (2 flexible modes):</span>
                </div>
                <div className="leading-relaxed text-[11px] space-y-1">
                  <p>
                    • <strong>Option A (Fast Checklist Mode)</strong>: Check <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">[✓]</span> which documents the applicant submitted and pick their issue dates. <em>No PDF upload required!</em>
                  </p>
                  <p>
                    • <strong>Option B (File Extraction Mode)</strong>: Click <Upload className="inline w-3 h-3 text-blue-600 dark:text-blue-400"/> on any card to upload actual PDF/DOCX files. EntitleTrace will parse text & dates automatically!
                  </p>
                </div>
              </div>

              {/* Dynamic Document List Items */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {managedDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all ${
                      doc.submitted
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Checkbox & Title */}
                      <button
                        type="button"
                        onClick={() => toggleDocSubmitted(idx)}
                        className="flex items-start gap-2 text-left"
                      >
                        {doc.submitted ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <div className={`text-xs font-bold ${doc.submitted ? 'text-slate-900 dark:text-white' : 'text-rose-700 dark:text-rose-300 line-through'}`}>
                            {doc.label}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Status: {doc.submitted ? 'Submitted' : 'Omitted / Missing'} {doc.isSchemeRequired && '• Mandatory'}
                          </div>
                        </div>
                      </button>

                      {/* Actions: File Upload & Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        <label className="cursor-pointer p-1 text-slate-500 hover:text-emerald-500 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Upload Document File (PDF/DOCX/TXT)">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={(e) => handleFileUpload(e, idx)}
                            className="hidden"
                          />
                        </label>

                        {!doc.isSchemeRequired && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(idx)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded"
                            title="Remove Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Issue Date Input (Shown if submitted) */}
                    {doc.submitted && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Issue Date:
                        </span>
                        <input
                          type="date"
                          value={doc.issue_date}
                          onChange={(e) => updateDocIssueDate(idx, e.target.value)}
                          className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Duplicate Warning Notification */}
              {duplicateWarning && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              {/* Add Extra Document Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  + Add Additional Optional Document
                </span>

                <div className="flex gap-2">
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    {ALL_DOC_OPTIONS.map((opt) => (
                      <option key={opt.type} value={opt.type}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={newDocIssueDate}
                    onChange={(e) => setNewDocIssueDate(e.target.value)}
                    className="px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />

                  <button
                    type="button"
                    onClick={handleAddExtraDocument}
                    className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Submit Analysis Button */}
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
                Click <strong>"Demo Case"</strong> above or fill in custom applicant details on the left to run deterministic rule analysis & clause evidence matching.
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
                  <span className="text-xs text-slate-400 font-normal">Ranked by BM25 + TF-IDF RRF Score</span>
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
