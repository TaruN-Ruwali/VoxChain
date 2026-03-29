import axios, { AxiosError } from 'axios';

// ── Base instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('voxchain_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: unwrap errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: boolean; message: string }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ── Auth API ───────────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  nationalId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      voterId: string;
      hasVoted: boolean;
      role: string;
    };
    token: string;
  };
}

export const authAPI = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/register', payload),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/login', payload),

  getMe: () => api.get<{ success: boolean; data: { user: AuthResponse['data']['user'] } }>('/me'),
};

// ── Vote API ───────────────────────────────────────────────────────────────
export interface VotePayload {
  candidateId: string;
  candidateName: string;
}

export interface VoteRecord {
  voterId: string;
  candidate: string;
  candidateId: string;
  transactionId: string;
  simulated: boolean;
  confirmedRound: number | null;
  timestamp: string;
}

export interface CandidateResult {
  candidateId: string;
  candidate: string;
  votes: number;
  lastVote?: string;
}

export interface ResultsResponse {
  success: boolean;
  data: {
    results: CandidateResult[];
    totalVotes: number;
    recentVotes: {
      candidate: string;
      candidateId: string;
      transactionId: string;
      simulated: boolean;
      createdAt: string;
    }[];
  };
}

export interface VerifyResponse {
  success: boolean;
  data: {
    voteRecord: VoteRecord;
    blockchain: {
      id: string;
      simulated: boolean;
      message?: string;
      sender?: string;
      round?: number;
    } | null;
  };
}

export const voteAPI = {
  castVote: (payload: VotePayload) =>
    api.post<{ success: boolean; message: string; data: { vote: VoteRecord } }>('/vote', payload),

  getResults: () => api.get<ResultsResponse>('/results'),

  verify: (txId: string) => api.get<VerifyResponse>(`/verify/${txId}`),
};

export default api;
