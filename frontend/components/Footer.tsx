'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-sm transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="space-y-1 text-center md:text-left">
          <p className="font-semibold text-slate-900 dark:text-slate-200">
            {t('footer.title', 'EntitleTrace — Welfare Rejection Diagnostic Aid')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('footer.subtitle', 'Academic Research Project (2026–27) | PCCOE Pune | Data Source: myScheme India')}
          </p>
        </div>

        <div className="flex gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('footer.about_project', 'About Project')}
          </Link>
          <Link href="/schemes" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('footer.schemes', 'Schemes')}
          </Link>
          <Link href="/insights" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {t('footer.analytics', 'Analytics')}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="bg-slate-50 dark:bg-slate-950/60 inline-block px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
          {t('footer.disclaimer', '⚠️ Mandatory Disclaimer: EntitleTrace provides diagnostic explanations using published scheme text. It does not decide official eligibility or legal entitlements.')}
        </p>
      </div>
    </footer>
  );
}
