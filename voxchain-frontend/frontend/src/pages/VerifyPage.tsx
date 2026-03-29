import { useState } from 'react';
import { useApp } from '../data/store';
import { voteAPI, VerifyResponse } from '../services/api';

export default function VerifyPage() {
  const { voter, isLoggedIn } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<VerifyResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRaw, setShowRaw] = useState(false);

  const handleVerify = async () => {
    const txId = query.trim();
    if (!txId) { setError('Please enter a transaction ID.'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await voteAPI.verify(txId);
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-slate-800 mb-2">Verify Your Vote</h1>
          <p className="text-slate-500 text-sm">
            Enter your transaction ID to verify your vote is recorded on the blockchain.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter Transaction ID (e.g. SIM3F2A... or on-chain tx ID)"
            className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="px-5 py-3.5 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap flex items-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
            ) : '🔍 Verify'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Voter identity card */}
        {isLoggedIn && voter && (
          <div className="bg-gradient-to-br from-primary-50 to-violet-50 border border-primary-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                {voter.name?.[0] || 'V'}
              </div>
              <div>
                <div className="text-sm font-medium text-primary-700">{voter.name}</div>
                <div className="font-mono text-xs text-primary-500">{voter.voterId}</div>
              </div>
              <div className="ml-auto flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Identity Verified
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-0.5">App ID</div>
                <div className="font-mono text-xs text-slate-700">
                  APP-{Math.abs((voter.voterId?.charCodeAt(2) || 0) * 1337) % 99999}
                </div>
              </div>
              <div className="bg-white/60 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-0.5">Vote Status</div>
                <div className={`text-xs font-medium ${voter.hasVoted ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {voter.hasVoted ? '✓ Voted' : 'Not yet voted'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result card */}
        {result ? (
          <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5 6.5-7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-body font-semibold text-slate-700 text-sm">Transaction Confirmed</span>
                </div>
                {result.voteRecord.simulated && (
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">Simulated</span>
                )}
              </div>

              <div className="divide-y divide-slate-50">
                {[
                  ['Transaction ID', result.voteRecord.transactionId, 'mono'],
                  ['Candidate', result.voteRecord.candidate, ''],
                  ['Voter ID (masked)', result.voteRecord.voterId.slice(0, 2) + '•••••', 'mono'],
                  ['Block', result.voteRecord.confirmedRound ? `#${result.voteRecord.confirmedRound}` : 'Pending', 'mono'],
                  ['Election', 'City Council 2024', ''],
                  ['Timestamp', new Date(result.voteRecord.timestamp).toLocaleString(), ''],
                ].map(([k, v, cls]) => (
                  <div key={k} className="px-5 py-3 flex justify-between items-center">
                    <span className="text-xs text-slate-500">{k}</span>
                    <span className={`text-xs font-medium text-slate-800 max-w-[55%] text-right truncate ${cls === 'mono' ? 'font-mono text-primary-500' : ''}`}>{v}</span>
                  </div>
                ))}
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Status</span>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Confirmed on VoxChain
                  </span>
                </div>
              </div>
            </div>

            {/* Blockchain data */}
            {result.blockchain && (
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="w-full py-3.5 border-2 border-primary-200 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                🔗 {showRaw ? 'Hide' : 'View on Blockchain'} (Raw Data)
              </button>
            )}

            {showRaw && result.blockchain && (
              <div className="bg-slate-900 rounded-2xl p-5 animate-slide-up">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-400">voxchain://transaction.json</span>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-mono">verified</span>
                </div>
                <pre className="text-xs font-mono text-emerald-300 leading-relaxed overflow-auto max-h-72">
                  {JSON.stringify(result.blockchain, null, 2)}
                </pre>
              </div>
            )}
          </>
        ) : !loading && !error && (
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-12 text-center">
            <div className="text-3xl mb-3">🔍</div>
            <div className="text-slate-500 text-sm">
              Enter a transaction ID above to verify a vote on the blockchain.
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-400 mt-8">
          Transaction IDs starting with <span className="font-mono">SIM</span> are simulated — real Algorand transactions use base32 IDs.
        </p>
      </div>
    </div>
  );
}
