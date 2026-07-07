import { useEffect, useRef, useState, useCallback } from 'react';
import socketService from '../services/socket.service';
import type {
  PublicRoomState,
  RoomPhase,
  GameQuestionPayload,
  GameResultPayload,
  GameEndedPayload,
  ErrorPayload,
  CreateRoomPayload,
} from '../types/socket.types';

export type MultiplayerPhase = 'menu' | 'lobby' | 'active' | 'result' | 'finished';

export interface MultiplayerState {
  phase: MultiplayerPhase;
  connected: boolean;
  room: PublicRoomState | null;
  currentQuestion: GameQuestionPayload | null;
  lastResult: GameResultPayload | null;
  gameEnded: GameEndedPayload | null;
  error: string | null;
  answerSubmitted: boolean;
  selectedAnswer: string | null;
}

const initialState: MultiplayerState = {
  phase: 'menu',
  connected: false,
  room: null,
  currentQuestion: null,
  lastResult: null,
  gameEnded: null,
  error: null,
  answerSubmitted: false,
  selectedAnswer: null,
};

const useMultiplayer = () => {
  const [state, setState] = useState<MultiplayerState>(initialState);
  const unsubs = useRef<(() => void)[]>([]);
  const connectedOnce = useRef(false);

  // Derive phase from room state
  const derivePhase = (roomPhase: RoomPhase | undefined): MultiplayerPhase => {
    switch (roomPhase) {
      case 'lobby':
      case 'starting':
        return 'lobby';
      case 'active':
        return 'active';
      case 'finished':
        return 'finished';
      default:
        return 'menu';
    }
  };

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL as string || 'http://localhost:5000';

    if (!connectedOnce.current) {
      socketService.connect(apiUrl);
      connectedOnce.current = true;
    }

    const u1 = socketService.on('_connected', () => {
      setState((prev) => ({ ...prev, connected: true, error: null }));
    });

    const u2 = socketService.on('_disconnected', () => {
      setState((prev) => ({ ...prev, connected: false }));
    });

    const u3 = socketService.on('room:created', (payload) => {
      const room = (payload as { room: PublicRoomState }).room;
      setState((prev) => ({
        ...prev,
        room,
        phase: 'lobby',
        error: null,
      }));
    });

    const u4 = socketService.on('room:joined', (payload) => {
      const room = (payload as { room: PublicRoomState }).room;
      setState((prev) => ({
        ...prev,
        room,
        phase: 'lobby',
        error: null,
      }));
    });

    const u5 = socketService.on('room:state', (payload) => {
      const room = (payload as { room: PublicRoomState }).room;
      setState((prev) => ({
        ...prev,
        room,
        phase: derivePhase(room.phase),
        error: null,
      }));
    });

    const u6 = socketService.on('room:updated', (payload) => {
      const room = (payload as { room?: PublicRoomState }).room;
      if (room) {
        setState((prev) => ({
          ...prev,
          room,
          phase: derivePhase(room.phase),
        }));
      }
    });

    const u7 = socketService.on('room:left', () => {
      setState({ ...initialState, connected: true });
    });

    const u8 = socketService.on('game:started', (payload) => {
      const data = payload as { room: PublicRoomState; scores: Record<string, number> };
      setState((prev) => ({
        ...prev,
        room: data.room,
        phase: 'active',
        currentQuestion: null,
        lastResult: null,
        gameEnded: null,
        answerSubmitted: false,
        selectedAnswer: null,
        error: null,
      }));
    });

    const u9 = socketService.on('game:question', (payload) => {
      const question = payload as unknown as GameQuestionPayload;
      setState((prev) => ({
        ...prev,
        currentQuestion: question,
        lastResult: null,
        answerSubmitted: false,
        selectedAnswer: null,
        phase: 'active',
      }));
    });

    const u10 = socketService.on('game:result', (payload) => {
      const result = payload as unknown as GameResultPayload;
      setState((prev) => ({
        ...prev,
        lastResult: result,
        phase: 'result',
      }));
    });

    const u11 = socketService.on('game:answer:ack', () => {
      // Answer was received by server
    });

    const u12 = socketService.on('game:ended', (payload) => {
      const ended = payload as unknown as GameEndedPayload;
      setState((prev) => ({
        ...prev,
        gameEnded: ended,
        phase: 'finished',
        currentQuestion: null,
      }));
    });

    const u13 = socketService.on('error', (payload) => {
      const err = payload as unknown as ErrorPayload;
      setState((prev) => ({
        ...prev,
        error: err.message,
      }));
    });

    unsubs.current = [u1, u2, u3, u4, u5, u6, u7, u8, u9, u10, u11, u12, u13];

    return () => {
      unsubs.current.forEach((fn) => fn());
      unsubs.current = [];
      socketService.disconnect();
      connectedOnce.current = false;
    };
  }, []);

  // ── Actions ──────────────────────────────────────────────────────

  const createRoom = useCallback((settings?: CreateRoomPayload) => {
    setState((prev) => ({ ...prev, error: null }));
    socketService.createRoom(settings ?? {});
  }, []);

  const joinRoom = useCallback((roomCode: string) => {
    setState((prev) => ({ ...prev, error: null }));
    socketService.joinRoom({ roomCode });
  }, []);

  const toggleReady = useCallback((roomCode: string, ready: boolean) => {
    socketService.setReady({ roomCode, ready });
  }, []);

  const leaveRoom = useCallback((roomCode?: string) => {
    socketService.leaveRoom({ roomCode });
  }, []);

  const startGame = useCallback((roomCode: string) => {
    socketService.startGame({ roomCode });
  }, []);

  const submitAnswer = useCallback((roomCode: string, answer: string) => {
    setState((prev) => ({ ...prev, answerSubmitted: true, selectedAnswer: answer }));
    socketService.submitAnswer({ roomCode, answer });
  }, []);

  const resetToMenu = useCallback(() => {
    setState((prev) => ({ ...initialState, connected: prev.connected }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    createRoom,
    joinRoom,
    toggleReady,
    leaveRoom,
    startGame,
    submitAnswer,
    resetToMenu,
    clearError,
  };
};

export default useMultiplayer;
