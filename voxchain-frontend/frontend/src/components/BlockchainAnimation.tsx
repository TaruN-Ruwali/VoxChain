import { useEffect, useState } from 'react';
import { useApp } from '../data/store';

interface AnimBlock {
  id: number;
  hash: string;
  votes: number;
  isActive: boolean;
}

const CHAIN_MESSAGES = [
  'Vote added to mempool',
  'Block created',
  'Hash verified ✓',
  'Consensus reached',
  'Block finalized',
  'Chain updated',
  'Transaction confirmed',
];

export default function BlockchainAnimation() {
  const { blocks } = useApp();
  const [animBlocks, setAnimBlocks] = useState<AnimBlock[]>([]);
  const [msgIdx, setMsgIdx] = useState(0);

  // Sync blocks from store — show last 5
  useEffect(() => {
    const last5 = blocks.slice(-5);
    setAnimBlocks(
      last5.map((bl, i) => ({
        id: bl.id,
        hash: bl.hash,
        votes: bl.votes,
        isActive: i === last5.length - 1,
      }))
    );
  }, [blocks]);

  // Rotate status message every 2.5s
  useEffect(() => {
    const iv = setInterval(
      () => setMsgIdx(i => (i + 1) % CHAIN_MESSAGES.length),
      2500
    );
    return () => clearInterval(iv);
  }, []);

  const latestHash = animBlocks[animBlocks.length - 1]?.hash ?? '0x0000...0000';
  // Truncate long real hashes for display
  const displayHash = latestHash.length > 20
    ? latestHash.slice(0, 10) + '...' + latestHash.slice(-6)
    : latestHash;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-body font-medium text-slate-300">Live Chain</span>
        </div>
        <span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
          {CHAIN_MESSAGES[msgIdx]}
        </span>
      </div>

      {/* Blocks */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {animBlocks.map((block, i) => (
          <div key={block.id} className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`relative w-24 h-24 rounded-xl border flex flex-col items-center justify-center transition-all duration-500 ${
                block.isActive
                  ? 'border-primary-400/60 bg-primary-500/20 shadow-lg shadow-primary-500/20 animate-pulse-slow'
                  : 'border-slate-600/60 bg-slate-700/60'
              }`}
            >
              <svg width="32" height="28" viewBox="0 0 32 28" fill="none" className="mb-1">
                <path
                  d="M16 2L30 10V18L16 26L2 18V10L16 2Z"
                  fill="none"
                  stroke={block.isActive ? '#7c8fff' : '#475569'}
                  strokeWidth="1.5"
                />
                <path
                  d="M16 2L16 14M16 14L30 10M16 14L2 10"
                  stroke={block.isActive ? '#7c8fff' : '#475569'}
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>
              <span className="font-mono text-[10px] text-slate-400">#{block.id}</span>
              <span className="font-mono text-[9px] text-slate-500 mt-0.5">{block.votes}v</span>
            </div>

            {/* Connector */}
            {i < animBlocks.length - 1 && (
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-6 h-0.5 bg-gradient-to-r from-primary-500/60 to-violet-500/60 rounded-full" />
                <div className="w-4 h-0.5 bg-gradient-to-r from-primary-500/40 to-violet-500/40 rounded-full" />
                <div className="w-2 h-0.5 bg-gradient-to-r from-primary-500/20 to-violet-500/20 rounded-full" />
              </div>
            )}
          </div>
        ))}

        {/* Pending block */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-6 h-0.5 bg-slate-600 rounded-full animate-pulse" />
          </div>
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-600/40 flex flex-col items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-slate-600 border-t-primary-400 animate-spin" />
            <span className="font-mono text-[9px] text-slate-600 mt-2">pending</span>
          </div>
        </div>
      </div>

      {/* Hash footer */}
      <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-mono">latest:</span>
          <span className="text-xs text-primary-400 font-mono truncate max-w-[180px]">
            {displayHash}
          </span>
          <span className="ml-auto text-xs text-emerald-400 font-mono flex items-center gap-1 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            verified
          </span>
        </div>
      </div>
    </div>
  );
}
