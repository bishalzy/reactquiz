import { SocketMessage } from "../types/socket.types";
import Endpoints from "../config/endpoints.config";

class SocketService {
  
    private socket: WebSocket | null = null;

    connect() {
        this.socket = new WebSocket(Endpoints.multiplayerSocket);
        this.socket.onopen = () => {
            console.log("WebSocket connection established");
        };
        this.socket.onclose = () => {
            console.log("WebSocket connection closed");
        };
        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    sendMessage(message: SocketMessage) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not open. Unable to send message.");
        }
    }

    onMessage(callback: (message: SocketMessage) => void) {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                const message: SocketMessage = JSON.parse(event.data);
                callback(message);
            };
        } else {
            console.warn("WebSocket is not initialized. Unable to set message handler.");
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }


}

export default SocketService;