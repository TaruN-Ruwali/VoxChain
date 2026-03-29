import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

// ── Types ──────────────────────────────────────────────────────────────────
export interface Candidate {
  id: string;
  name: string;
  party: string;
  bio: string;
  avatar: string;
  color: string;
}

export interface VoteRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  txHash: string;
  blockNumber: number;
  timestamp: Date;
  simulated?: boolean;
}

export interface Block {
  id: number;
  hash: string;
  prevHash: string;
  votes: number;
  timestamp: Date;
}

export interface Voter {
  _id: string;
  name: string;
  email: string;
  voterId: string;
  hasVoted: boolean;
  role: string;
}

interface AppState {
  isLoggedIn: boolean;
  voter: Voter | null;
  token: string | null;
  hasVoted: boolean;
  selectedCandidate: string | null;
  blocks: Block[];
  activityFeed: string[];
  authLoading: boolean;
}

interface AppContextType extends AppState {
  loginWithData: (voter: Voter, token: string) => void;
  logout: () => void;
  selectCandidate: (id: string) => void;
  setHasVoted: (val: boolean) => void;
  addBlock: (block: Block) => void;
  addActivity: (msg: string) => void;
  setAuthLoading: (val: boolean) => void;
}

// ── Static seed blocks shown before any real votes ────────────────────────
const seedBlocks: Block[] = [
  { id: 1, hash: '0x3f4ab2c1d9e8f012', prevHash: '0x0000000000000000', votes: 47, timestamp: new Date(Date.now() - 3600000) },
  { id: 2, hash: '0x7d2ea9f3c1b05e87', prevHash: '0x3f4ab2c1d9e8f012', votes: 53, timestamp: new Date(Date.now() - 1800000) },
  { id: 3, hash: '0x1b8ce5d7a4f23091', prevHash: '0x7d2ea9f3c1b05e87', votes: 61, timestamp: new Date(Date.now() - 900000) },
];

const SEED_FEED = [
  'Block #3 verified — 61 votes recorded',
  'New vote → Dr. Evelyn Reyes',
  'Hash 0x1b8c...e5d7 confirmed',
  'Block #2 finalized',
  'New vote → Marcus Hale',
];

// ── Restore session from localStorage ─────────────────────────────────────
const restoreSession = (): { voter: Voter | null; token: string | null } => {
  try {
    const token = localStorage.getItem('voxchain_token');
    const raw = localStorage.getItem('voxchain_user');
    if (token && raw) {
      const voter = JSON.parse(raw) as Voter;
      return { voter, token };
    }
  } catch {
    // corrupted storage — clear it
    localStorage.removeItem('voxchain_token');
    localStorage.removeItem('voxchain_user');
  }
  return { voter: null, token: null };
};

// ── Context ────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { voter: savedVoter, token: savedToken } = restoreSession();

  const [state, setState] = useState<AppState>({
    isLoggedIn: !!savedVoter,
    voter: savedVoter,
    token: savedToken,
    hasVoted: savedVoter?.hasVoted ?? false,
    selectedCandidate: null,
    blocks: [...seedBlocks],
    activityFeed: [...SEED_FEED],
    authLoading: !!savedVoter, // true while we re-validate the token
  });

  // ── Re-validate stored token on mount ────────────────────────────────────
  useEffect(() => {
    if (!savedToken) return;
    authAPI.getMe()
      .then(({ data }) => {
        const freshUser = data.data.user;
        localStorage.setItem('voxchain_user', JSON.stringify(freshUser));
        setState(s => ({
          ...s,
          voter: freshUser as unknown as Voter,
          hasVoted: freshUser.hasVoted,
          isLoggedIn: true,
          authLoading: false,
        }));
      })
      .catch(() => {
        // Token expired / invalid
        localStorage.removeItem('voxchain_token');
        localStorage.removeItem('voxchain_user');
        setState(s => ({ ...s, isLoggedIn: false, voter: null, token: null, authLoading: false }));
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loginWithData = (voter: Voter, token: string) => {
    localStorage.setItem('voxchain_token', token);
    localStorage.setItem('voxchain_user', JSON.stringify(voter));
    setState(s => ({
      ...s,
      isLoggedIn: true,
      voter,
      token,
      hasVoted: voter.hasVoted,
      authLoading: false,
    }));
  };

  const logout = () => {
    localStorage.removeItem('voxchain_token');
    localStorage.removeItem('voxchain_user');
    setState(s => ({
      ...s,
      isLoggedIn: false,
      voter: null,
      token: null,
      hasVoted: false,
      selectedCandidate: null,
    }));
  };

  const selectCandidate = (id: string) =>
    setState(s => ({ ...s, selectedCandidate: id }));

  const setHasVoted = (val: boolean) => {
    setState(s => ({
      ...s,
      hasVoted: val,
      voter: s.voter ? { ...s.voter, hasVoted: val } : s.voter,
    }));
    // Sync into localStorage
    const raw = localStorage.getItem('voxchain_user');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        localStorage.setItem('voxchain_user', JSON.stringify({ ...user, hasVoted: val }));
      } catch { /* ignore */ }
    }
  };

  const addBlock = (block: Block) =>
    setState(s => ({ ...s, blocks: [...s.blocks, block] }));

  const addActivity = (msg: string) =>
    setState(s => ({ ...s, activityFeed: [msg, ...s.activityFeed].slice(0, 10) }));

  const setAuthLoading = (val: boolean) =>
    setState(s => ({ ...s, authLoading: val }));

  return (
    <AppContext.Provider
      value={{
        ...state,
        loginWithData,
        logout,
        selectCandidate,
        setHasVoted,
        addBlock,
        addActivity,
        setAuthLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ── Static candidate data (IDs must match what backend stores) ─────────────
export const candidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Dr. Evelyn Reyes',
    party: 'Progress Alliance',
    bio: 'Leading expert in sustainable infrastructure with 12 years of civic leadership.',
    avatar: 'ER',
    color: '#5b6af5',
  },
  {
    id: 'c2',
    name: 'Marcus Hale',
    party: 'Citizens First',
    bio: 'Former city planner advocating for transparent governance and digital rights.',
    avatar: 'MH',
    color: '#9254f5',
  },
  {
    id: 'c3',
    name: 'Priya Nair',
    party: 'Green Future',
    bio: 'Environmental scientist committed to climate action and community empowerment.',
    avatar: 'PN',
    color: '#10b981',
  },
  {
    id: 'c4',
    name: 'James Okafor',
    party: 'Unity Coalition',
    bio: 'Community organizer focused on economic equity and educational reform.',
    avatar: 'JO',
    color: '#f59e0b',
  },
];
