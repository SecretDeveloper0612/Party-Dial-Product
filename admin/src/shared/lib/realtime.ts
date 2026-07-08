type EventCallback = (payload: any) => void;

export class RealtimeClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private rooms: Set<string> = new Set();
  public status: "connecting" | "connected" | "reconnecting" | "offline" = "offline";
  private onStatusChange?: (status: string) => void;

  constructor(url: string, token: string, onStatusChange?: (status: string) => void) {
    this.url = url;
    this.token = token;
    this.onStatusChange = onStatusChange;
  }

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    
    this.updateStatus(this.reconnectAttempts > 0 ? "reconnecting" : "connecting");
    
    const wsUrl = `${this.url}?token=${this.token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.updateStatus("connected");
      this.startHeartbeat();
      this.rejoinRooms();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "pong") return;
        
        if (data.type === "event" && data.event) {
          this.triggerEvent(data.event, data.payload);
        }
      } catch (err) {
        console.error("WebSocket message parsing error:", err);
      }
    };

    this.ws.onclose = (event) => {
      this.stopHeartbeat();
      if (event.code !== 1000) {
        this.handleReconnect();
      } else {
        this.updateStatus("offline");
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  public disconnect() {
    this.updateStatus("offline");
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, "User disconnected");
      this.ws = null;
    }
  }

  public subscribe(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.unsubscribe(event, callback);
  }

  public unsubscribe(event: string, callback: EventCallback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  public emit(event: string, room: string, payload: any) {
    this.send({ type: "emit", event, room, payload });
  }

  public joinRoom(room: string) {
    this.rooms.add(room);
    this.send({ type: "subscribe", room });
  }

  public leaveRoom(room: string) {
    this.rooms.delete(room);
    this.send({ type: "unsubscribe", room });
  }

  private send(data: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private triggerEvent(event: string, payload: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(payload));
    }
  }

  private handleReconnect() {
    if (this.status === "offline") return; // Intentional disconnect
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.updateStatus("reconnecting");
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), delay);
    } else {
      this.updateStatus("offline");
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      this.send({ type: "ping" });
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private rejoinRooms() {
    this.rooms.forEach(room => {
      this.send({ type: "subscribe", room });
    });
  }

  private updateStatus(newStatus: "connecting" | "connected" | "reconnecting" | "offline") {
    this.status = newStatus;
    if (this.onStatusChange) {
      this.onStatusChange(this.status);
    }
  }
}
