'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchSchemes, Scheme } from '@/lib/api';
import { Search, Filter, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchemes();
  }, [searchQuery, selectedLevel, selectedCategory]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const res = await fetchSchemes({
        q: searchQuery || undefined,
        level: selectedLevel || undefined,
        category: selectedCategory || undefined,
        limit: 50
      });
      setSchemes(res.schemes);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-emerald-500" />
          <span>Government Welfare Scheme Explorer</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse central and state welfare scheme rules, eligibility guidelines, and document requirements.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 shadow-sm">
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search scheme name, education, farmer, housing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Level Filter */}
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-medium"
        >
          <option value="">All Levels (Central & State)</option>
          <option value="Central">Central Govt Schemes</option>
          <option value="State">State Govt Schemes</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-medium"
        >
          <option value="">All Categories</option>
          <option value="Education">Education & Scholarships</option>
          <option value="Agriculture">Agriculture & Farming</option>
          <option value="Housing">Housing</option>
          <option value="Women Welfare">Women Welfare</option>
          <option value="Health">Health Insurance</option>
          <option value="Financial Services">Financial & Micro Credit</option>
        </select>

      </div>

      {/* Scheme Cards List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Loading scheme catalog...</div>
      ) : schemes.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-500">No matching schemes found for your query.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.scheme_id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    scheme.level === 'Central'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}>
                    {scheme.level} ({scheme.state})
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">{scheme.scheme_id}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {scheme.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                  {scheme.details}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{scheme.target_group || 'All Citizens'}</span>
                
                <Link
                  href={`/schemes/${scheme.scheme_id}`}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                >
                  <span>View Rules & Clauses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
