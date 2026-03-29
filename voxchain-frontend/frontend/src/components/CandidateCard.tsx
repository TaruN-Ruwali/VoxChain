import { Candidate } from '../data/store';

interface Props {
  candidate: Candidate;
  selected: boolean;
  hasVoted: boolean;
  voteCount: number;
  onSelect: (id: string) => void;
}

export default function CandidateCard({ candidate, selected, hasVoted, voteCount, onSelect }: Props) {
  return (
    <div
      onClick={() => !hasVoted && onSelect(candidate.id)}
      className={`relative rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
        selected
          ? 'border-primary-400 bg-primary-50 shadow-lg shadow-primary-100'
          : hasVoted
          ? 'border-slate-100 bg-white opacity-60 cursor-not-allowed'
          : 'border-slate-100 bg-white hover:border-primary-200 hover:shadow-md hover:shadow-primary-50'
      }`}
    >
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-display text-lg font-bold shadow-sm flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${candidate.color}dd, ${candidate.color}88)` }}
        >
          {candidate.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-body font-semibold text-slate-800 text-base leading-tight">{candidate.name}</h3>
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-body font-medium"
            style={{ backgroundColor: candidate.color + '20', color: candidate.color }}
          >
            {candidate.party}
          </span>
          <p className="mt-2 text-sm text-slate-500 font-body leading-relaxed">{candidate.bio}</p>
        </div>
      </div>

      {hasVoted && voteCount > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500 font-body">{voteCount} votes</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (voteCount / 400) * 100)}%`, backgroundColor: candidate.color }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
