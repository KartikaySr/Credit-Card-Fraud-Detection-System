'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="p-6 bg-gray-900/50 rounded-full border border-white/5 shadow-2xl">
        <ShieldAlert className="w-16 h-16 text-gray-400" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-white tracking-tight">
        Module Locked
      </h1>
      
      <p className="text-lg text-gray-400 max-w-lg">
        This enterprise module is currently slated for Phase 4 deployment. Advanced security configurations and scaling protocols are being finalized.
      </p>

      <div className="pt-8">
        <Link 
          href="/dashboard/ecosystem"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all font-medium shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Ecosystem
        </Link>
      </div>
    </div>
  );
}
