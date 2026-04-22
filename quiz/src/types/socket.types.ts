export type socketEvent = "gameStart" | "gameEnd" | "playerJoined" | "playerLeft" | "newQuestion" | "answerResult" | "createRoom" | "joinRoom" | "leaveRoom";

type GameStartPayload = {
  gameId: string;
  players: string[];
};

type GameEndPayload = {
  gameId: string;
  winner: string;
};

type PlayerJoinedPayload = {
  gameId: string;
  playerName: string;
};

type PlayerLeftPayload = {
  gameId: string;
  playerName: string;
};

type NewQuestionPayload = {
  gameId: string;
  question: string;
};

type AnswerResultPayload = {
  gameId: string;
  playerName: string;
  selectedAnswer: number;
};

type CreateRoomPayload = {
  playerName: string;
};

type JoinRoomPayload = {
  roomId: string;
  playerName: string;
};

type LeaveRoomPayload = {
  roomId: string;
  playerName: string;
}

type PayloadMap = {
  gameStart: GameStartPayload;
  gameEnd: GameEndPayload;
  playerJoined: PlayerJoinedPayload;
  playerLeft: PlayerLeftPayload;
  newQuestion: NewQuestionPayload;
  answerResult: AnswerResultPayload;
  createRoom: CreateRoomPayload;
  joinRoom: JoinRoomPayload;
  leaveRoom: LeaveRoomPayload;
};

export type SocketMessage = {
  event: socketEvent;
  payload: PayloadMap[socketEvent];
};