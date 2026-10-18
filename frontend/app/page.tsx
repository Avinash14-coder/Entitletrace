'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, FileText, CheckCircle2, Search, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 py-4">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('home.badge', 'Government Scheme Rejection Diagnostic System')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {t('home.hero_title_part1', 'Understand Why Welfare Applications Fail & Link Rejections to ')}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
            {t('home.hero_title_gradient', 'Official Scheme Rules')}
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {t('home.hero_subtitle', 'EntitleTrace translates vague rejection remarks like "documents incomplete" into precise failure categories, runs deterministic rule checks, and highlights exact clause evidence from government published rules.')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/analyze?demo=worked"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t('home.try_sample', 'Try Acceptance Demo Case')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/analyze?mode=custom"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-base flex items-center justify-center gap-2 transition-all"
          >
            <span>{t('home.analyze_custom', 'Analyze Custom Application')}</span>
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('home.f1_title', '1. Find the Exact Reason')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('home.f1_desc', 'Categorizes generic rejection remarks into a standard 10-category failure taxonomy.')}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('home.f2_title', '2. See the Official Rule')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('home.f2_desc', 'Uses hybrid dense (BGE-M3) and BM25 sparse search to retrieve the exact section of published scheme rules.')}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('home.f3_title', '3. Get Corrective Action')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('home.f3_desc', 'Provides deterministic step-by-step guidance on how to fix the rejection.')}
          </p>
        </div>
      </section>

      {/* How it Works Stepper */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('home.stepper_title', 'How EntitleTrace Works')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('home.stepper_subtitle', 'End-to-end evidence pipeline in 3 transparent steps')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-200">
                {t('home.s1_title', 'Scheme & Case Entry')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('home.s1_desc', 'Select scheme from myScheme database and enter applicant income, age, state, and uploaded document issue dates.')}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-200">
                {t('home.s2_title', 'Hybrid Rule & NLP Engine')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('home.s2_desc', 'Deterministic engine calculates math limits while NLP classifier predicts failure taxonomy.')}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-200">
                {t('home.s3_title', 'Evidence Link & Action')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('home.s3_desc', 'Retrieves source clause text with direct official links and provides clear, actionable corrective steps.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations Banner */}
      <section className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-4 rounded-xl flex items-center gap-4 text-xs text-amber-900 dark:text-amber-200">
        <Lightbulb className="w-6 h-6 text-amber-600 shrink-0" />
        <div>
          <strong>{t('home.note_title', 'Important Note:')}</strong> {t('home.note_desc', 'EntitleTrace is an academic explanation aid. It does not connect to government portals, does not approve or reject applications, and does not determine legal entitlement.')}
        </div>
      </section>

    </div>
  );
}
