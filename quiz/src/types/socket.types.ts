// ── Client → Server events ──────────────────────────────────────────

export type ClientSocketEvent =
  | 'room:create'
  | 'room:join'
  | 'room:ready'
  | 'room:leave'
  | 'room:get'
  | 'game:start'
  | 'game:answer'
  | 'ping';

// ── Server → Client events ──────────────────────────────────────────

export type ServerSocketEvent =
  | 'room:created'
  | 'room:joined'
  | 'room:left'
  | 'room:state'
  | 'room:updated'
  | 'game:started'
  | 'game:question'
  | 'game:result'
  | 'game:answer:ack'
  | 'game:ended'
  | 'error'
  | 'pong';

// ── Shared room / player types ──────────────────────────────────────

export type RoomPhase = 'lobby' | 'starting' | 'active' | 'finished';

export interface PublicPlayerState {
  userId: number;
  username: string;
  ready: boolean;
  connected: boolean;
  score: number;
  joinedAt: number;
}

export interface PublicQuestionState {
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  options: string[];
}

export interface PublicRoomState {
  roomCode: string;
  hostUserId: number;
  hostUsername: string;
  phase: RoomPhase;
  createdAt: number;
  updatedAt: number;
  lastActivityAt: number;
  minPlayers: number;
  maxPlayers: number;
  questionCount: number;
  questionTimeoutMs: number;
  category?: number;
  difficulty?: string;
  type?: string;
  currentQuestionIndex: number;
  currentQuestionStartedAt: number | null;
  currentQuestionEndsAt: number | null;
  players: PublicPlayerState[];
  currentQuestion: PublicQuestionState | null;
}

// ── Client payloads ─────────────────────────────────────────────────

export interface CreateRoomPayload {
  minPlayers?: number;
  maxPlayers?: number;
  questionCount?: number;
  questionTimeoutMs?: number;
  category?: number;
  difficulty?: string;
  type?: string;
}

export interface JoinRoomPayload {
  roomCode: string;
}

export interface ReadyRoomPayload {
  roomCode: string;
  ready: boolean;
}

export interface LeaveRoomPayload {
  roomCode?: string;
}

export interface StartGamePayload {
  roomCode: string;
}

export interface SubmitAnswerPayload {
  roomCode: string;
  answer: string;
}

export interface GetRoomPayload {
  roomCode?: string;
}

// ── Server payloads ─────────────────────────────────────────────────

export interface RoomCreatedPayload {
  room: PublicRoomState;
}

export interface RoomJoinedPayload {
  room: PublicRoomState;
}

export interface RoomStatePayload {
  room: PublicRoomState;
}

export interface RoomUpdatedPayload {
  room: PublicRoomState;
}

export interface GameStartedPayload {
  roomCode: string;
  room: PublicRoomState;
  scores: Record<string, number>;
}

export interface GameQuestionPayload {
  roomCode: string;
  questionIndex: number;
  totalQuestions: number;
  question: PublicQuestionState;
  endsAt: number | null;
  scores: Record<string, number>;
}

export interface GameResultPayload {
  roomCode: string;
  questionIndex: number;
  reason: 'timeout' | 'all-answered';
  correctAnswer: string;
  scores: Record<string, number>;
}

export interface GameEndedPayload {
  roomCode: string;
  finalScores: Record<string, number>;
  winners: { userId: number; username: string; score: number }[];
}

export interface ErrorPayload {
  message: string;
  roomCode?: string;
}

// ── Generic message wrappers ────────────────────────────────────────

export interface SocketMessage {
  event: ClientSocketEvent;
  payload: Record<string, unknown>;
}

export interface ServerSocketMessage {
  event: ServerSocketEvent;
  payload: Record<string, unknown>;
}