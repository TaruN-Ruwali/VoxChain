import { useState, useEffect, useCallback, useRef } from 'react';
import { voteAPI, CandidateResult } from '../services/api';
import { getSocket, VoteUpdatePayload, CurrentResultsPayload } from '../services/socket';

interface UseResultsReturn {
  results: CandidateResult[];
  totalVotes: number;
  recentVotes: Array<{
    candidate: string;
    candidateId: string;
    transactionId: string;
    simulated: boolean;
    createdAt: string;
  }>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useResults(): UseResultsReturn {
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [recentVotes, setRecentVotes] = useState<UseResultsReturn['recentVotes']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      const { data } = await voteAPI.getResults();
      setResults(data.data.results);
      setTotalVotes(data.data.totalVotes);
      setRecentVotes(data.data.recentVotes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchResults();

    // Socket.io real-time updates
    const socket = getSocket();

    const handleVoteUpdate = (payload: VoteUpdatePayload) => {
      setResults(payload.results);
      setTotalVotes(payload.totalVotes);
    };

    const handleCurrentResults = (payload: CurrentResultsPayload) => {
      setResults(payload.results);
      setTotalVotes(payload.totalVotes);
      setLoading(false);
    };

    socket.on('voteUpdate', handleVoteUpdate);
    socket.on('currentResults', handleCurrentResults);

    // Polling fallback every 3 seconds
    pollRef.current = setInterval(fetchResults, 3000);

    return () => {
      socket.off('voteUpdate', handleVoteUpdate);
      socket.off('currentResults', handleCurrentResults);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchResults]);

  return { results, totalVotes, recentVotes, loading, error, refetch: fetchResults };
}
