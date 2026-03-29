import { Link } from 'react-router-dom';
import { useApp } from '../data/store';

function VotingIllustration() {
  return (
    <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
      <circle cx="200" cy="170" r="140" fill="url(#bgGrad)" opacity="0.12"/>
      <rect x="130" y="180" width="140" height="100" rx="14" fill="url(#boxGrad)" stroke="#c7d6ff" strokeWidth="1.5"/>
      <rect x="170" y="192" width="60" height="8" rx="4" fill="white" opacity="0.85"/>
      <rect x="170" y="192" width="60" height="8" rx="4" stroke="#a4b8ff" strokeWidth="1"/>
      <circle cx="200" cy="240" r="14" fill="white" opacity="0.9"/>
      <path d="M196 238v-3a4 4 0 018 0v3" stroke="#5b6af5" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="193" y="238" width="14" height="10" rx="2" fill="#5b6af5" opacity="0.8"/>
      <circle cx="200" cy="243" r="1.5" fill="white"/>
      <g className="animate-float">
        <rect x="182" y="150" width="36" height="28" rx="4" fill="white" stroke="#a4b8ff" strokeWidth="1.5"/>
        <line x1="189" y1="160" x2="210" y2="160" stroke="#c7d6ff" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="189" y1="166" x2="205" y2="166" stroke="#e0e9ff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M190 157l2.5 2.5 5-5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <circle cx="120" cy="130" r="22" fill="url(#personGrad)"/>
      <path d="M90 220 Q95 175 120 160 Q145 175 150 220" fill="url(#personGrad)" opacity="0.85"/>
      <path d="M140 175 Q155 165 172 158" stroke="#7c8fff" strokeWidth="8" strokeLinecap="round"/>
      <g transform="translate(265, 60)" opacity="0.85">
        {[0, 38, 76].map((x, i) => (
          <rect key={i} x={x} y={i === 1 ? 5 : 10} width="30" height="30" rx="5" fill={i === 1 ? '#f0e8ff' : '#e0e9ff'} stroke={i === 1 ? '#c9b3ff' : '#a4b8ff'} strokeWidth="1.2"/>
        ))}
        <line x1="30" y1="25" x2="38" y2="25" stroke="#a4b8ff" strokeWidth="1.5" strokeDasharray="3 2"/>
        <line x1="68" y1="25" x2="76" y2="25" stroke="#a4b8ff" strokeWidth="1.5" strokeDasharray="3 2"/>
      </g>
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5b6af5"/><stop offset="100%" stopColor="#9254f5"/>
        </linearGradient>
        <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e9ff"/><stop offset="100%" stopColor="#c7d6ff"/>
        </linearGradient>
        <linearGradient id="personGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c8fff"/><stop offset="100%" stopColor="#5b6af5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

const features = [
  { icon: '🔐', title: 'Cryptographically Secure', desc: 'Every vote is hashed and immutably recorded on-chain with military-grade encryption.' },
  { icon: '🔍', title: 'Fully Transparent', desc: 'Anyone can verify results without revealing voter identity.' },
  { icon: '⚡', title: 'Real-Time Results', desc: 'Live election data streamed via Socket.io as votes are cast.' },
];

export default function HomePage() {
  const { isLoggedIn } = useApp();

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-primary-600">Election Active — City Council 2024</span>
            </div>
            <h1 className="font-display text-5xl lg:text-6xl text-slate-900 leading-tight mb-6">
              Secure Blockchain<br />
              <span className="bg-gradient-to-r from-primary-500 to-violet-600 bg-clip-text text-transparent">
                Voting System
              </span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
              Your vote, permanently recorded. Verifiable by anyone, tampered by none. Democratic participation powered by blockchain and real-time Socket.io updates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={isLoggedIn ? '/vote' : '/register'}
                className="px-7 py-3.5 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                {isLoggedIn ? 'Go to Ballot →' : 'Start Voting →'}
              </Link>
              <Link
                to="/results"
                className="px-7 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all duration-200"
              >
                View Live Results
              </Link>
            </div>
            <div className="mt-12 flex gap-8">
              {[['370+', 'Votes Cast'], ['4', 'Candidates'], ['Real-time', 'Updates']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl text-slate-800">{val}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center animate-fade-in">
            <VotingIllustration />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50/50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl text-slate-800 text-center mb-2">Why VoxChain?</h2>
          <p className="text-slate-500 text-center mb-12">Built on cryptographic trust, not just promises.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-500 to-violet-600 rounded-3xl p-12 text-white shadow-2xl shadow-primary-200">
            <h2 className="font-display text-3xl mb-3">Ready to vote?</h2>
            <p className="text-primary-100 mb-8">Register your identity once, vote securely forever.</p>
            <Link
              to={isLoggedIn ? '/vote' : '/register'}
              className="inline-block px-8 py-3.5 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-md"
            >
              {isLoggedIn ? 'Cast Your Vote' : 'Create Your Voter ID'}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 px-6 text-center">
        <span className="text-sm text-slate-400">© 2024 VoxChain. Blockchain-powered democratic participation.</span>
      </footer>
    </div>
  );
}
