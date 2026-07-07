import type {
  ClientSocketEvent,
  ServerSocketEvent,
  ServerSocketMessage,
  CreateRoomPayload,
  JoinRoomPayload,
  ReadyRoomPayload,
  LeaveRoomPayload,
  StartGamePayload,
  SubmitAnswerPayload,
  GetRoomPayload,
} from '../types/socket.types';

type EventCallback = (payload: Record<string, unknown>) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private listeners = new Map<string, Set<EventCallback>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private url: string = '';
  private shouldReconnect = false;
  private _connected = false;

  get connected(): boolean {
    return this._connected;
  }

  connect(httpUrl: string): void {
    // Convert http(s) to ws(s)
    this.url = httpUrl.replace(/^http/, 'ws') + '/ws/multiplayer';
    this.shouldReconnect = true;
    this.createSocket();
  }

  private createSocket(): void {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
      }
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this._connected = true;
      this.emit('_connected', {});
      this.startPing();
    };

    this.socket.onclose = () => {
      this._connected = false;
      this.stopPing();
      this.emit('_disconnected', {});
      if (this.shouldReconnect) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = () => {
      // onclose will fire after this
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data as string) as ServerSocketMessage;
        this.emit(message.event, message.payload);
      } catch {
        // ignore malformed messages
      }
    };
  }

  private pingInterval: ReturnType<typeof setInterval> | null = null;

  private startPing(): void {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      this.send('ping', {});
    }, 25000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldReconnect) {
        this.createSocket();
      }
    }, 2000);
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.stopPing();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this._connected = false;
  }

  // ── Send helpers ─────────────────────────────────────────────────

  private send(event: ClientSocketEvent, payload: Record<string, unknown>): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ event, payload }));
    }
  }

  createRoom(payload: CreateRoomPayload = {}): void {
    this.send('room:create', payload as unknown as Record<string, unknown>);
  }

  joinRoom(payload: JoinRoomPayload): void {
    this.send('room:join', payload as unknown as Record<string, unknown>);
  }

  setReady(payload: ReadyRoomPayload): void {
    this.send('room:ready', payload as unknown as Record<string, unknown>);
  }

  leaveRoom(payload: LeaveRoomPayload = {}): void {
    this.send('room:leave', payload as unknown as Record<string, unknown>);
  }

  startGame(payload: StartGamePayload): void {
    this.send('game:start', payload as unknown as Record<string, unknown>);
  }

  submitAnswer(payload: SubmitAnswerPayload): void {
    this.send('game:answer', payload as unknown as Record<string, unknown>);
  }

  getRoom(payload: GetRoomPayload = {}): void {
    this.send('room:get', payload as unknown as Record<string, unknown>);
  }

  // ── Event emitter ────────────────────────────────────────────────

  on(event: ServerSocketEvent | '_connected' | '_disconnected', callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, payload: Record<string, unknown>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const cb of callbacks) {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in socket event handler for "${event}":`, err);
        }
      }
    }
  }
}

// Singleton instance
const socketService = new SocketService();
export default socketService;