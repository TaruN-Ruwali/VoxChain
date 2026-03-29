import { useApp, candidates } from '../data/store';
import { useResults } from '../hooks/useResults';
import BlockchainAnimation from '../components/BlockchainAnimation';
import ChartComponent from '../components/ChartComponent';

export default function ResultsPage() {
  const { activityFeed, blocks } = useApp();
  const { results, totalVotes, recentVotes, loading, error } = useResults();

  // Map API results to a lookup by candidateId
  const votesById: Record<string, number> = {};
  results.forEach(r => { votesById[r.candidateId] = r.votes; });

  // Find leading candidate from live results
  const leading = results.length > 0
    ? candidates.find(c => c.id === results[0].candidateId) || candidates[0]
    : candidates[0];

  const leadingVotes = results[0]?.votes ?? 0;

  // Merge live results with candidate metadata, sorted by votes desc
  const sortedCandidates = candidates
    .map(c => ({ ...c, votes: votesById[c.id] || 0 }))
    .sort((a, b) => b.votes - a.votes);

  // Build activity feed: combine real recent votes + store activity
  const liveActivity = [
    ...recentVotes.slice(0, 5).map(v => `New vote → ${v.candidate}`),
    ...activityFeed,
  ].slice(0, 10);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
            </span>
            <span className="text-slate-400 text-xs font-mono">
              {loading ? 'Connecting...' : `${totalVotes} votes recorded`}
            </span>
            {error && (
              <span className="text-xs text-red-400 ml-2">⚠ {error}</span>
            )}
          </div>
          <h1 className="font-display text-3xl text-slate-800">Live Election Results</h1>
          <p className="text-slate-500 text-sm mt-1">City Council Election 2024 — updated in real time via Socket.io</p>
        </div>

        {/* Leader card */}
        <div className="bg-gradient-to-r from-primary-500 to-violet-600 rounded-2xl p-6 text-white mb-8 shadow-lg shadow-primary-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-display text-lg">
              {leading.avatar}
            </div>
            <div>
              <div className="text-sm text-primary-100">Currently Leading</div>
              <div className="font-display text-xl">{leading.name}</div>
              <div className="text-sm text-primary-200">{leading.party}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="font-mono text-3xl font-bold">
                {loading ? '—' : leadingVotes}
              </div>
              <div className="text-sm text-primary-200">votes</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── Left col: Blockchain + stats + feed ── */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-body font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-400" />
                Blockchain Visualization
              </h2>
              <BlockchainAnimation />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-mono font-bold text-primary-500">{blocks.length}</div>
                <div className="text-xs text-slate-500 mt-0.5">Blocks Created</div>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-mono font-bold text-emerald-500">
                  {loading ? '—' : totalVotes}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Total Votes</div>
              </div>
            </div>

            {/* Live activity feed */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                <span className="text-sm font-body font-semibold text-slate-700">Live Activity</span>
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> streaming
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {liveActivity.map((msg, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center gap-3 text-sm animate-fade-in">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                    <span className="text-slate-600 font-body truncate">{msg}</span>
                    <span className="ml-auto text-xs text-slate-300 font-mono flex-shrink-0">
                      {i === 0 ? 'now' : `${(i + 1) * 15}s`}
                    </span>
                  </div>
                ))}
                {liveActivity.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-slate-400">No activity yet</div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right col: Charts + breakdown ── */}
          <div className="lg:col-span-3">
            <h2 className="font-body font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              Vote Distribution
            </h2>

            <ChartComponent votesById={votesById} totalVotes={totalVotes} />

            {/* Candidate breakdown */}
            <div className="mt-4 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-50">
                <span className="text-sm font-body font-semibold text-slate-700">Candidate Breakdown</span>
              </div>
              <div className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                      <div className="w-8 h-8 rounded-lg bg-slate-100" />
                      <div className="flex-1">
                        <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                        <div className="h-1.5 bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))
                ) : (
                  sortedCandidates.map((c, rank) => {
                    const pct = totalVotes ? Math.round((c.votes / totalVotes) * 100) : 0;
                    return (
                      <div key={c.id} className="px-5 py-3 flex items-center gap-4">
                        <span className="text-sm font-mono text-slate-300 w-4">{rank + 1}</span>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-700">{c.name}</div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, backgroundColor: c.color }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono text-sm font-bold text-slate-700">{pct}%</div>
                          <div className="text-xs text-slate-400">{c.votes}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
