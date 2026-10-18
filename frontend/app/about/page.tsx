'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Cpu,
  Database,
  FileCheck,
  Search,
  BookOpen,
  Award,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
  Code
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('about.badge', 'About EntitleTrace NLP System')}</span>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('about.title', 'System Architecture & Technical Methodology')}
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {t('about.subtitle', 'EntitleTrace is an explanation and diagnosis aid for government welfare scheme rejections. It pairs deterministic rule engines with hybrid dense/sparse vector retrieval to bridge the gap between vague rejection remarks and official scheme guidelines.')}
        </p>
      </div>

      {/* Grid: 3 Core Pillars */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('about.p1_title', 'Deterministic Rules First')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('about.p1_desc', 'Evaluates strict threshold rules (income ceilings, age ranges, document validity windows, category restrictions) to guarantee zero false positives when mathematical bounds are breached.')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('about.p2_title', 'Hybrid Retrieval (RRF)')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('about.p2_desc', 'Combines sparse lexical BM25 search with TF-IDF cosine similarity via Reciprocal Rank Fusion (RRF) to retrieve official clause text fragments from myScheme data.')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('about.p3_title', 'Multilingual NLP')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('about.p3_desc', 'Script-based Devanagari inspector and marker word matching distinguishes Hindi and Marathi rejection remarks from English texts.')}
          </p>
        </div>
      </div>

      {/* System Pipeline Diagram / Explanation */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-6 h-6 text-emerald-500" />
          <span>{t('about.pipeline_title', 'End-to-End Processing Trajectory')}</span>
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('about.step1_h', 'Input Ingestion & Normalization')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t('about.step1_p', 'Applicant metadata, submitted certificate validity dates, and rejection remark text are ingested and canonicalized.')}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('about.step2_h', 'Deterministic Rule Engine')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t('about.step2_p', 'Evaluates income limits, age bounds, domicile requirements, and certificate freshness (≤ 365 days) against official scheme criteria.')}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('about.step3_h', 'Hybrid Retrieval & Evidence Linking')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t('about.step3_p', 'Merges BM25 lexical matching and TF-IDF semantic scores to extract exact legal clauses justifying the diagnostic outcome.')}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('about.step4_h', 'Multilingual Resolution & Remediation')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t('about.step4_p', 'Generates contextual corrective steps in Marathi, Hindi, or English to guide citizen remediation.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Benchmark Table */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>Experimental Evaluation Benchmarks</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="p-3 rounded-l-lg">Component / Model</th>
                <th className="p-3">Evaluation Metric</th>
                <th className="p-3">Measured Benchmark</th>
                <th className="p-3 rounded-r-lg">Notes & Dataset Split</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Failure Classifier</td>
                <td className="p-3">Macro F1 Score</td>
                <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">1.0</td>
                <td className="p-3 text-slate-500">Evaluated on 15% stratified test split (52 synthetic cases)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Held-out Schemes</td>
                <td className="p-3">Macro F1 Score</td>
                <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">1.0</td>
                <td className="p-3 text-slate-500">Tested on unseen demo schemes (58 cases)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Hybrid Retriever</td>
                <td className="p-3">Recall @ 3</td>
                <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">0.8846 (88.5%)</td>
                <td className="p-3 text-slate-500">Primary matching clause in top-3 candidates</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Hybrid Retriever</td>
                <td className="p-3">Mean Reciprocal Rank (MRR)</td>
                <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">0.6128</td>
                <td className="p-3 text-slate-500">Average reciprocal position of correct clause</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Deterministic Rules</td>
                <td className="p-3">Unit Test Pass Rate</td>
                <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">100% (4/4)</td>
                <td className="p-3 text-slate-500">Covers max income, document validity, missing docs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
