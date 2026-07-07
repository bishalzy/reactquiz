import { useState, useEffect, useCallback } from 'react';
import './multi.css';
import useMultiplayer from '../hooks/useMultiplayer';
import useAuth from '../hooks/useAuth';

// ── Helpers ────────────────────────────────────────────────────────

const decodeHtml = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};


// ── Timer hook ─────────────────────────────────────────────────────

const useCountdown = (endsAt: number | null | undefined): number => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!endsAt) {
      setRemaining(0);
      return;
    }

    const tick = () => {
      const diff = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(diff);
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [endsAt]);

  return remaining;
};

// ── Sub-components ─────────────────────────────────────────────────

const ConnectionBadge = ({ connected }: { connected: boolean }) => (
  <div className={`mp-conn-badge ${connected ? 'mp-conn-badge--online' : 'mp-conn-badge--offline'}`}>
    <span className="mp-conn-dot" />
    {connected ? 'Connected' : 'Reconnecting…'}
  </div>
);

const ErrorToast = ({ message, onDismiss }: { message: string; onDismiss: () => void }) => (
  <div className="mp-error">
    <span> {message}</span>
    <button onClick={onDismiss}>×</button>
  </div>
);

// ── Menu Phase ─────────────────────────────────────────────────────

const MenuPhase = ({
  connected,
  onCreateRoom,
  onJoinRoom,
}: {
  connected: boolean;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
}) => {
  const [joinCode, setJoinCode] = useState('');

  const handleJoin = () => {
    const code = joinCode.trim();
    if (code.length >= 4) {
      onJoinRoom(code);
    }
  };

  return (
    <div className="mp-menu">
      <h2>Multiplayer</h2>
      <div className="mp-menu-actions">
        <button
          className="mp-btn mp-btn--primary"
          disabled={!connected}
          onClick={onCreateRoom}
        >
          Create Room
        </button>

        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>or join an existing room</div>

        <div className="mp-join-form">
          <input
            className="mp-join-input"
            type="text"
            placeholder="Room Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            maxLength={6}
          />
          <button
            className="mp-btn mp-btn--secondary"
            disabled={!connected || joinCode.trim().length < 4}
            onClick={handleJoin}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Lobby Phase ────────────────────────────────────────────────────

const LobbyPhase = ({
  room,
  userId,
  onToggleReady,
  onStartGame,
  onLeaveRoom,
}: {
  room: NonNullable<ReturnType<typeof useMultiplayer>['state']['room']>;
  userId: number;
  onToggleReady: (roomCode: string, ready: boolean) => void;
  onStartGame: (roomCode: string) => void;
  onLeaveRoom: (roomCode: string) => void;
}) => {
  const isHost = room.hostUserId === userId;
  const myPlayer = room.players.find((p) => p.userId === userId);
  const connectedPlayers = room.players.filter((p) => p.connected);
  const allReady = connectedPlayers.length >= room.minPlayers && connectedPlayers.every((p) => p.userId === room.hostUserId || p.ready);

  return (
    <div className="mp-lobby">
      <div className="mp-lobby-header">
        <h2>Game Lobby</h2>
        <div className="mp-room-code" title="Click to copy" onClick={() => navigator.clipboard?.writeText(room.roomCode)}>
          <span className="mp-room-code-label">Room</span>
          {room.roomCode}
        </div>
      </div>

      <div className="mp-lobby-settings">
        <span>{room.questionCount} questions</span>
        <span>{room.questionTimeoutMs / 1000}s per question</span>
        {room.difficulty && <span>{room.difficulty}</span>}
      </div>
      <div style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>
        Note: Only Computer Science questions are used in multiplayer.
      </div>

      <div className="mp-players-list">
        {room.players.map((player) => (
          <div key={player.userId} className={`mp-player-card ${!player.connected ? 'mp-player-card--disconnected' : ''}`}>
            <div className="mp-player-avatar">
              {player.username.charAt(0).toUpperCase()}
            </div>
            <div className="mp-player-info">
              <div className="mp-player-name">
                {player.username} {player.userId === userId ? '(You)' : ''}
              </div>
              <div className="mp-player-badges">
                {player.userId === room.hostUserId && <span className="mp-badge mp-badge--host">Host</span>}
                {!player.connected ? (
                  <span className="mp-badge mp-badge--disconnected">Offline</span>
                ) : player.userId === room.hostUserId ? null : player.ready ? (
                  <span className="mp-badge mp-badge--ready">Ready</span>
                ) : (
                  <span className="mp-badge mp-badge--not-ready">Not Ready</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mp-lobby-actions">
        {!isHost && (
          <button
            className={`mp-btn ${myPlayer?.ready ? 'mp-btn--ghost' : 'mp-btn--ready'}`}
            onClick={() => onToggleReady(room.roomCode, !myPlayer?.ready)}
          >
            {myPlayer?.ready ? 'Unready' : 'Ready Up'}
          </button>
        )}

        {isHost && (
          <button
            className="mp-btn mp-btn--primary"
            disabled={!allReady}
            onClick={() => onStartGame(room.roomCode)}
            title={!allReady ? `Need ${room.minPlayers} ready players to start` : undefined}
          >
            Start Game
          </button>
        )}

        <button className="mp-btn mp-btn--ghost" onClick={() => onLeaveRoom(room.roomCode)}>
          Leave Room
        </button>
      </div>
    </div>
  );
};

// ── Active Phase (Gameplay) ────────────────────────────────────────

const ActivePhase = ({
  question,
  answerSubmitted,
  selectedAnswer,
  onSubmitAnswer,
  roomCode,
}: {
  question: NonNullable<ReturnType<typeof useMultiplayer>['state']['currentQuestion']>;
  answerSubmitted: boolean;
  selectedAnswer: string | null;
  onSubmitAnswer: (roomCode: string, answer: string) => void;
  roomCode: string;
}) => {
  const countdown = useCountdown(question.endsAt);
  const options = question.question.options;

  const timerClass = countdown <= 3 ? 'mp-timer--danger' : countdown <= 7 ? 'mp-timer--warning' : 'mp-timer--normal';

  return (
    <div className="mp-game">
      <div className="mp-game-header">
        <span className="mp-question-counter">
          Question {question.questionIndex + 1} / {question.totalQuestions}
        </span>
        <div className={`mp-timer ${timerClass}`}>
          {countdown}s
        </div>
      </div>

      <div className="mp-question-card">
        <div className="mp-question-meta">
          <span>{decodeHtml(question.question.category)}</span>
          <span>{question.question.difficulty}</span>
          <span>{question.question.type === 'boolean' ? 'True/False' : 'Multiple Choice'}</span>
        </div>
        <p className="mp-question-text">{decodeHtml(question.question.question)}</p>
      </div>

      <div className="mp-options-grid">
        {options.map((option, idx) => {
          const decodedOption = decodeHtml(option);
          const isSelected = selectedAnswer === option;
          const disabled = answerSubmitted;

          return (
            <div
              key={idx}
              className={`mp-option ${isSelected ? 'mp-option--selected' : ''} ${disabled ? 'mp-option--disabled' : ''}`}
              onClick={() => !disabled && onSubmitAnswer(roomCode, option)}
            >
              <span className="mp-option-marker">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{decodedOption}</span>
            </div>
          );
        })}
      </div>

      {answerSubmitted && (
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Answer submitted — waiting for other players...
        </div>
      )}

      {/* Live scores */}
      {question.scores && (
        <div className="mp-live-scores">
          <h4>Scores</h4>
          {Object.entries(question.scores)
            .sort(([, a], [, b]) => b - a)
            .map(([id, score]) => (
              <div key={id} className="mp-live-score-entry">
                <span>Player #{id}</span>
                <span>{score}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// ── Result Phase ───────────────────────────────────────────────────

const ResultPhase = ({
  result,
  selectedAnswer,
  isLastQuestion,
}: {
  result: NonNullable<ReturnType<typeof useMultiplayer>['state']['lastResult']>;
  selectedAnswer: string | null;
  isLastQuestion: boolean;
}) => {
  const wasCorrect = selectedAnswer !== null && selectedAnswer === result.correctAnswer;

  return (
    <div className="mp-result">

      <h3>{wasCorrect ? 'Correct!' : selectedAnswer ? 'Wrong!' : 'Time\'s Up!'}</h3>
      <div className="mp-result-answer">
        Correct answer: {decodeHtml(result.correctAnswer)}
      </div>

      <div className="mp-result-scores">
        {Object.entries(result.scores)
          .sort(([, a], [, b]) => b - a)
          .map(([id, score]) => (
            <div key={id} className="mp-result-score-row">
              <span>Player #{id}</span>
              <span>{score} pts</span>
            </div>
          ))}
      </div>

      <div className="mp-result-waiting">{isLastQuestion ? 'Game over! Calculating results...' : 'Next question loading…'}</div>
    </div>
  );
};

// ── Finished Phase ─────────────────────────────────────────────────

const FinishedPhase = ({
  gameEnded,
  onPlayAgain,
  onBackToMenu,
}: {
  gameEnded: NonNullable<ReturnType<typeof useMultiplayer>['state']['gameEnded']>;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}) => {
  const sortedScores = Object.entries(gameEnded.finalScores).sort(([, a], [, b]) => b - a);
  const winner = gameEnded.winners[0];

  return (
    <div className="mp-finished">

      <h2>Game Over!</h2>
      {winner && <div className="mp-winner">{winner.username} wins with {winner.score} points!</div>}

      <div className="mp-final-scores">
        {sortedScores.map(([id, score], idx) => {
          const player = gameEnded.winners.find((w) => w.userId.toString() === id);
          return (
            <div key={id} className="mp-final-score-row">
              <span className="mp-final-rank">#{idx + 1}</span>
              <span className="mp-final-name">{player?.username ?? `Player #${id}`}</span>
              <span className="mp-final-points">{score}</span>
            </div>
          );
        })}
      </div>

      <div className="mp-finished-actions">
        <button className="mp-btn mp-btn--primary" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="mp-btn mp-btn--ghost" onClick={onBackToMenu}>
          Back to Menu
        </button>
      </div>
    </div>
  );
};

// ── Main Multi Component ───────────────────────────────────────────

const Multi: React.FC = () => {
  const { user } = useAuth();
  const {
    state,
    createRoom,
    joinRoom,
    toggleReady,
    leaveRoom,
    startGame,
    submitAnswer,
    resetToMenu,
    clearError,
  } = useMultiplayer();

  const userId = user?.id ?? 0;

  const handleCreateRoom = useCallback(() => {
    createRoom({ questionCount: 10, questionTimeoutMs: 15000 });
  }, [createRoom]);

  const handleLeaveRoom = useCallback(
    (roomCode: string) => {
      leaveRoom(roomCode);
    },
    [leaveRoom],
  );

  return (
    <div className="mp-container">
      <ConnectionBadge connected={state.connected} />

      {state.error && <ErrorToast message={state.error} onDismiss={clearError} />}

      {state.phase === 'menu' && (
        <MenuPhase
          connected={state.connected}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={joinRoom}
        />
      )}

      {state.phase === 'lobby' && state.room && (
        <LobbyPhase
          room={state.room}
          userId={userId}
          onToggleReady={toggleReady}
          onStartGame={startGame}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {state.phase === 'active' && state.currentQuestion && (
        <ActivePhase
          question={state.currentQuestion}
          answerSubmitted={state.answerSubmitted}
          selectedAnswer={state.selectedAnswer}
          onSubmitAnswer={submitAnswer}
          roomCode={state.room?.roomCode ?? ''}
        />
      )}

      {state.phase === 'result' && state.lastResult && (
        <ResultPhase 
          result={state.lastResult} 
          selectedAnswer={state.selectedAnswer} 
          isLastQuestion={state.lastResult.questionIndex === (state.room?.questionCount ?? 0) - 1}
        />
      )}

      {state.phase === 'finished' && state.gameEnded && (
        <FinishedPhase gameEnded={state.gameEnded} onPlayAgain={handleCreateRoom} onBackToMenu={resetToMenu} />
      )}
    </div>
  );
};

export default Multi;
