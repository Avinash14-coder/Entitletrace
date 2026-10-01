'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchFailureAnalytics,
  fetchTopicAnalytics,
  fetchTaxonomy,
  FailureAnalytics,
  TopicAnalytics
} from '@/lib/api';
import {
  BarChart3,
  PieChart,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  Globe,
  Tag,
  ArrowUpRight,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function InsightsPage() {
  const [analytics, setAnalytics] = useState<FailureAnalytics | null>(null);
  const [topics, setTopics] = useState<TopicAnalytics | null>(null);
  const [taxonomy, setTaxonomy] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [searchTaxonomy, setSearchTaxonomy] = useState('');

  useEffect(() => {
    Promise.all([
      fetchFailureAnalytics().catch(() => null),
      fetchTopicAnalytics().catch(() => null),
      fetchTaxonomy().catch(() => ({}))
    ]).then(([anaData, topicData, taxData]) => {
      setAnalytics(anaData);
      setTopics(topicData);
      setTaxonomy(taxData);
    }).finally(() => setLoading(false));
  }, []);

  const failureEntries = analytics ? Object.entries(analytics.by_failure_type) : [];
  const maxFailureCount = failureEntries.reduce((max, [_, cnt]) => Math.max(max, cnt), 1);

  const langEntries = analytics ? Object.entries(analytics.by_language) : [];

  const taxonomyEntries = Object.entries(taxonomy).filter(([key, val]) => {
    if (!searchTaxonomy) return true;
    const q = searchTaxonomy.toLowerCase();
    const nameEn = val.display_name?.en?.toLowerCase() || '';
    const nameHi = val.display_name?.hi?.toLowerCase() || '';
    const nameMr = val.display_name?.mr?.toLowerCase() || '';
    const desc = val.description?.toLowerCase() || '';
    return key.toLowerCase().includes(q) || nameEn.includes(q) || nameHi.includes(q) || nameMr.includes(q) || desc.includes(q);
  });

  return (
    <div className="space-y-8 py-2">
      
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-emerald-500" />
            <span>Rejection Analytics & Failure Taxonomy</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Empirical distribution of rejection causes, NMF topic modeling themes, and standard 10-class taxonomy.
          </p>
        </div>

        {/* Language Switcher for Action Templates */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs border border-slate-200 dark:border-slate-700">
          <Globe className="w-4 h-4 text-slate-500 ml-2" />
          <button
            onClick={() => setSelectedLang('en')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${selectedLang === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLang('hi')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${selectedLang === 'hi' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setSelectedLang('mr')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${selectedLang === 'mr' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Analyzed Cases</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {analytics?.total_cases || 50}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Evaluated across demo & synthetic dataset</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Taxonomy Classes</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Object.keys(taxonomy).length || 10}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Standard rejection categories</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Topics</div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {topics?.total_topics || 5}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">NMF Unsupervised Remark Clusters</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Multilingual Support</div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            3
          </div>
          <p className="text-[11px] text-slate-500 mt-1">English, Devanagari Hindi & Marathi</p>
        </div>
      </div>

      {/* Grid: Failure Breakdown Chart & Multilingual Breakdown */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Failure Type Distribution */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" />
            <span>Rejection Causes Breakdown</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Frequency count of primary rejection labels across all processed applications.
          </p>

          <div className="space-y-3 pt-2">
            {failureEntries.map(([ftype, count]) => {
              const taxItem = taxonomy[ftype];
              const displayName = taxItem?.display_name?.[selectedLang] || taxItem?.display_name?.en || ftype.replace(/_/g, ' ');
              const pct = Math.round((count / (analytics?.total_cases || 1)) * 100);
              const barWidth = Math.max(8, Math.round((count / maxFailureCount) * 100));

              return (
                <div key={ftype} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2 capitalize">
                      <Tag className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{displayName}</span>
                      <span className="font-mono text-[11px] text-slate-400">({ftype})</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {count} cases ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Breakdown & Key Insights */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span>Language Distribution</span>
            </h3>

            <div className="space-y-3">
              {langEntries.map(([lcode, count]) => {
                const labelMap: Record<string, string> = { en: 'English', hi: 'Hindi (हिंदी)', mr: 'Marathi (मराठी)' };
                const pct = Math.round((count / (analytics?.total_cases || 1)) * 100);
                return (
                  <div key={lcode} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{labelMap[lcode] || lcode}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Code: {lcode}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{count}</span>
                      <span className="text-xs text-slate-400 ml-1">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-5 rounded-2xl space-y-2 text-xs text-emerald-950 dark:text-emerald-200">
            <div className="font-bold text-sm flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>Deterministic Priority Rule</span>
            </div>
            <p className="leading-relaxed">
              When deterministic rule evaluation fails (e.g. document age exceeds 365 days or income exceeds scheme ceiling), EntitleTrace overrides statistical NLP classifier predictions to guarantee 100% precision.
            </p>
          </div>

        </div>
      </div>

      {/* Topic Modeling Section */}
      {topics && topics.topics && topics.topics.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>NMF Unsupervised Topic Clusters from Rejection Remarks</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Non-Negative Matrix Factorization (NMF) extracts recurring semantic clusters across unstructured rejection texts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {topics.topics.map((t) => (
              <div key={t.topic_id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-bold">
                    {t.weight_pct}%
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {t.top_terms.map((term, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono">
                      #{term}
                    </span>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700/60 pt-2 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sample Remarks:</span>
                  {t.sample_remarks.map((rem, i) => (
                    <p key={i} className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">
                      "{rem}"
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failure Taxonomy Explorer Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              <span>Standard 10-Class Failure Taxonomy & Template Actions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Complete catalog of standardized rejection labels, descriptions, and multilingual corrective action templates.
            </p>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search taxonomy label..."
              value={searchTaxonomy}
              onChange={(e) => setSearchTaxonomy(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {taxonomyEntries.map(([label, item]) => {
            const displayName = item.display_name?.[selectedLang] || item.display_name?.en || label;
            const actionTemplate = item.action_template?.[selectedLang] || item.action_template?.en || 'N/A';

            return (
              <div key={label} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {displayName}
                  </h3>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                    {label}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase tracking-wider">
                    Corrective Action Template ({selectedLang.toUpperCase()}):
                  </span>
                  <p className="text-xs text-emerald-950 dark:text-emerald-100 font-medium">
                    {actionTemplate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
