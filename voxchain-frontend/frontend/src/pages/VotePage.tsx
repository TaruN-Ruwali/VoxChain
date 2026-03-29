import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, candidates } from '../data/store';
import { voteAPI, VoteRecord } from '../services/api';
import CandidateCard from '../components/CandidateCard';

export default function VotePage() {
  const { isLoggedIn, voter, hasVoted, selectedCandidate, selectCandidate, setHasVoted, addBlock, addActivity } = useApp();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<VoteRecord | null>(null);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async () => {
    if (!selectedCandidate || submitting) return;

    const cand = candidates.find(c => c.id === selectedCandidate);
    if (!cand) return;

    setSubmitting(true);
    setApiError('');

    try {
      const { data } = await voteAPI.castVote({
        candidateId: selectedCandidate,
        candidateName: cand.name,
      });

      const vote = data.data.vote;

      // Update global state
      setHasVoted(true);

      // Add a new block to the blockchain visualization
      addBlock({
        id: Date.now(),
        hash: vote.transactionId,
        prevHash: '0x' + Math.random().toString(16).slice(2, 18),
        votes: 1,
        timestamp: new Date(vote.timestamp),
      });

      addActivity(`New vote → ${vote.candidate}`);
      addActivity(`Block created — tx ${vote.transactionId.slice(0, 12)}...`);
      addActivity(`Hash ${vote.transactionId.slice(0, 16)}... verified`);

      setReceipt(vote);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to cast vote. Please try again.';
      setApiError(msg);
      // If already voted error, sync state
      if (msg.toLowerCase().includes('already')) {
        setHasVoted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Auth gate ─────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-display text-2xl text-slate-800 mb-2">Authentication Required</h2>
          <p className="text-slate-500 text-sm mb-6">You need to log in with your Voter ID to access the ballot.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl">Log In</Link>
            <Link to="/register" className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success receipt ───────────────────────────────────────────────────────
  if (receipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 to-primary-50/30 flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center animate-slide-up">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#d1fae5"/>
                <path d="M12 20l6 6 10-12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full opacity-30" style={{ animation: 'ping 1.5s ease-out infinite' }} />
          </div>

          <h2 className="font-display text-2xl text-slate-800 mb-1">Vote Recorded!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your ballot is immutably recorded on the blockchain.
            {receipt.simulated && (
              <span className="block text-xs text-slate-400 mt-1">(Simulation mode — no real chain tx)</span>
            )}
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-100 space-y-3 mb-6">
            {[
              ['Voted for', receipt.candidate],
              ['Transaction ID', receipt.transactionId],
              ['Voter ID', voter?.voterId ?? '—'],
              ['Timestamp', new Date(receipt.timestamp).toLocaleString()],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className={`font-medium text-slate-800 max-w-[55%] text-right truncate ${label === 'Transaction ID' ? 'font-mono text-primary-500 text-xs' : ''}`}>
                  {value}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Confirmed
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/results')}
              className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl"
            >
              View Live Results
            </button>
            <button
              onClick={() => navigate('/verify')}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
            >
              Verify Vote
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Already voted state ───────────────────────────────────────────────────
  if (hasVoted && !receipt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="font-display text-2xl text-slate-800 mb-2">You've Already Voted</h2>
          <p className="text-slate-500 text-sm mb-6">Your vote has been recorded on the blockchain. Each voter may only vote once.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/results')} className="px-6 py-3 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl">View Results</button>
            <button onClick={() => navigate('/verify')} className="px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Verify Vote</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Voting ballot ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-100">
              🟢 Active Election
            </span>
            <span className="text-slate-400 text-xs">2d 04h remaining</span>
          </div>
          <h1 className="font-display text-3xl text-slate-800">City Council Election 2024</h1>
          <p className="text-slate-500 text-sm mt-1">Select one candidate and submit your encrypted ballot.</p>
        </div>

        {/* Voter badge */}
        <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
            {voter?.name?.[0] || 'V'}
          </div>
          <div>
            <div className="text-sm font-medium text-primary-700">Logged in as {voter?.name}</div>
            <div className="text-xs font-mono text-primary-500">{voter?.voterId}</div>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Verified
          </div>
        </div>

        {/* Error */}
        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {apiError}
          </div>
        )}

        {/* Candidate grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {candidates.map(c => (
            <CandidateCard
              key={c.id}
              candidate={c}
              selected={selectedCandidate === c.id}
              hasVoted={false}
              voteCount={0}
              onSelect={selectCandidate}
            />
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCandidate || submitting}
          className="w-full py-4 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-200 hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Recording on blockchain...
            </>
          ) : selectedCandidate ? (
            `Submit Vote for ${candidates.find(c => c.id === selectedCandidate)?.name.split(' ')[0]}`
          ) : (
            'Select a candidate to vote'
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-4 font-body">
          🔐 Your vote is end-to-end encrypted. You can only vote once per election.
        </p>
      </div>
    </div>
  );
}
