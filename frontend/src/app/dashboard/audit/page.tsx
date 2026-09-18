'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileKey, Terminal, CheckCircle } from 'lucide-react';

const mockLogs = [
  { id: 'sig_9x28fja', timestamp: new Date(Date.now() - 12000).toISOString(), actor: 'SYSTEM_XGBOOST_V2', action: 'FLAGGED_TRANSACTION', target: 'TXN-9912', risk: 'HIGH', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  { id: 'sig_8j92ma1', timestamp: new Date(Date.now() - 45000).toISOString(), actor: 'ADMIN_KARTIKAY', action: 'UPDATED_THRESHOLD', target: 'RULE_V4_ANOMALY', risk: 'LOW', hash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' },
  { id: 'sig_39vnm1a', timestamp: new Date(Date.now() - 145000).toISOString(), actor: 'SYSTEM_LIGHTGBM_V4', action: 'APPROVED_TRANSACTION', target: 'TXN-8812', risk: 'LOW', hash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945' },
  { id: 'sig_71nnz88', timestamp: new Date(Date.now() - 325000).toISOString(), actor: 'SYSTEM_FEDERATED_WORKER', action: 'WEIGHTS_SYNC', target: 'GLOBAL_MODEL', risk: 'MEDIUM', hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0' },
  { id: 'sig_001ma2b', timestamp: new Date(Date.now() - 500000).toISOString(), actor: 'SYSTEM_XGBOOST_V2', action: 'FLAGGED_TRANSACTION', target: 'TXN-7123', risk: 'HIGH', hash: 'f2c1d3b4a5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2' },
];

export default function AuditLogPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500 flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-500" /> Cryptographic Audit Log
        </h1>
        <p className="text-gray-400 mt-2">Non-repudiation ledger of all system actions and model decisions. Secured via SHA-256 signatures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold">Ledger Integrity</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-500 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Verified</p>
          <p className="text-xs text-gray-500 mt-1">Last hash check: Just now</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <FileKey className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Signatures Logged</h3>
          </div>
          <p className="text-2xl font-bold">14,291</p>
          <p className="text-xs text-gray-500 mt-1">Past 24 hours</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">Key Rotation</h3>
          </div>
          <p className="text-2xl font-bold">12 Days</p>
          <p className="text-xs text-gray-500 mt-1">Until next automated KMS rotation</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2"><Terminal className="w-4 h-4 text-gray-400" /> Immutable Ledger Stream</h3>
          <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full animate-pulse border border-emerald-500/30">SYNCING LIVE</span>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Decrypting ledger signatures...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono">
              <thead className="text-xs text-gray-500 uppercase bg-black/20 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">Actor / System</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Target</th>
                  <th className="px-6 py-4 font-semibold">SHA-256 Hash Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${log.actor.includes('ADMIN') ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {log.actor}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${log.action.includes('FLAGGED') ? 'text-rose-400' : log.action.includes('APPROVED') ? 'text-emerald-400' : 'text-gray-300'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{log.target}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[200px]" title={log.hash}>
                      {log.hash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
