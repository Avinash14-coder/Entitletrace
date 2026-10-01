import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="space-y-1 text-center md:text-left">
          <p className="font-semibold text-slate-200">
            EntitleTrace — Welfare Rejection Diagnostic Aid
          </p>
          <p className="text-xs text-slate-500">
            Academic Research Project (2026–27) | PCCOE Pune | Data Source: myScheme India
          </p>
        </div>

        <div className="flex gap-6 text-xs text-slate-400">
          <Link href="/about" className="hover:text-emerald-400 transition-colors">About Project</Link>
          <Link href="/schemes" className="hover:text-emerald-400 transition-colors">Schemes</Link>
          <Link href="/insights" className="hover:text-emerald-400 transition-colors">Analytics</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <p className="bg-slate-950/60 inline-block px-4 py-2 rounded-lg border border-slate-800">
          ⚠️ <strong>Mandatory Disclaimer:</strong> EntitleTrace provides diagnostic explanations using published scheme text. It does not decide official eligibility or legal entitlements.
        </p>
      </div>
    </footer>
  );
}
