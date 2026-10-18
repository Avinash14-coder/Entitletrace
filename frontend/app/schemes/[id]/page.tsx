'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchSchemeDetail, Scheme } from '@/lib/api';
import { ArrowLeft, ExternalLink, ShieldCheck, FileText, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SchemeDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const schemeId = params.id as string;

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (schemeId) {
      fetchSchemeDetail(schemeId)
        .then((data) => setScheme(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [schemeId]);

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-500">{t('scheme_detail.loading', 'Loading scheme detail...')}</div>;
  }

  if (!scheme) {
    return <div className="py-16 text-center text-sm text-rose-500">{t('scheme_detail.not_found', 'Scheme not found.')}</div>;
  }

  return (
    <div className="space-y-8 py-2">
      
      {/* Back Link */}
      <Link href="/schemes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-500 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('scheme_detail.back', 'Back to Scheme Explorer')}</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold">
              {scheme.level} ({scheme.state})
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              {scheme.categories || 'Welfare'}
            </span>
          </div>

          <span className="text-xs font-mono text-slate-400">ID: {scheme.scheme_id}</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {scheme.name}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {scheme.details}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {scheme.source_url && (
            <a
              href={scheme.source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <span>{t('scheme_detail.official_portal', 'View Official myScheme Portal')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <Link
            href={`/analyze?demo=worked`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow shadow-emerald-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('scheme_detail.analyze_under_scheme', 'Analyze Application Under This Scheme')}</span>
          </Link>
        </div>
      </div>

      {/* Grid Section: Eligibility, Documents, Process, Benefits */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Eligibility Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>{t('scheme_detail.eligibility_rules', 'Official Eligibility Rules')}</span>
          </h3>
          <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {scheme.eligibility}
          </div>
        </div>

        {/* Required Documents Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>{t('scheme_detail.required_docs', 'Mandatory & Required Documents')}</span>
          </h3>
          <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {scheme.documents_required}
          </div>
        </div>

        {/* Application Process Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            <span>{t('scheme_detail.application_process', 'Application Process & Submission Steps')}</span>
          </h3>
          <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {scheme.application_process}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{t('scheme_detail.benefits', 'Scheme Benefits & Financial Entitlement')}</span>
          </h3>
          <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {scheme.benefits}
          </div>
        </div>

      </div>

      {/* Linked Clauses Section */}
      {scheme.clauses && scheme.clauses.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <span>{t('scheme_detail.rules_clauses', 'Formal Rule Clauses in Knowledge Base')} ({scheme.clauses.length})</span>
          </h2>

          <div className="space-y-3">
            {scheme.clauses.map((clause, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {clause.clause_id} ({clause.section})
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {clause.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
