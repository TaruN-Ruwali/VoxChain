import { io, Socket } from 'socket.io-client';
import type { CandidateResult } from './api';

let socket: Socket | null = null;

export interface VoteUpdatePayload {
  candidateId: string;
  candidateName: string;
  results: CandidateResult[];
  totalVotes: number;
  latestTransaction: {
    txId: string;
    simulated: boolean;
    timestamp: string;
  };
}

export interface CurrentResultsPayload {
  results: CandidateResult[];
  totalVotes: number;
}

export const getSocket = (): Socket => {
  if (!socket || !socket.connected) {
    socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket.io connected:', socket!.id);
      socket!.emit('requestResults');
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.io disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('🔌 Socket.io connection error:', err.message);
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
