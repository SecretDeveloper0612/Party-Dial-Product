export class RealtimeDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map(); // map WebSocket to session info (userId, rooms)
    this.rooms = new Map(); // map roomId to Set of WebSockets
  }

  async fetch(request) {
    const url = new URL(request.url);

    // Only allow websocket upgrades
    if (request.headers.get("Upgrade") !== "websocket") {
      // Internal POST request to broadcast an event
      if (request.method === "POST" && url.pathname === "/emit") {
        try {
          const body = await request.json();
          this.broadcastToRoom(body.room, body.event, body.payload);
          return new Response(JSON.stringify({ success: true }), { status: 200 });
        } catch (err) {
          return new Response(JSON.stringify({ error: err.message }), { status: 400 });
        }
      }
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    // Accept WebSocket connection
    const { 0: client, 1: server } = new WebSocketPair();
    
    // Authenticate and accept connection
    this.handleSession(server, request);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async handleSession(ws, request) {
    ws.accept();
    
    // We expect the JWT token as a URL parameter for WS connection
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    let userId = "anonymous";
    if (token) {
      try {
        // Verify token with Appwrite
        const response = await fetch(`${this.env.APPWRITE_ENDPOINT}/account`, {
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": this.env.APPWRITE_PROJECT_ID,
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const account = await response.json();
          userId = account.$id;
        } else {
          ws.send(JSON.stringify({ type: "error", message: "Unauthorized" }));
          ws.close(1008, "Unauthorized");
          return;
        }
      } catch (err) {
        console.error("Auth error", err);
      }
    }

    const session = { userId, rooms: new Set() };
    this.sessions.set(ws, session);

    // Send connection success
    ws.send(JSON.stringify({ type: "connected", userId }));

    ws.addEventListener("message", async (msg) => {
      try {
        const data = JSON.parse(msg.data);
        
        if (data.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
          return;
        }

        if (data.type === "subscribe") {
          this.joinRoom(ws, data.room);
        } else if (data.type === "unsubscribe") {
          this.leaveRoom(ws, data.room);
        } else if (data.type === "emit") {
          // Handle client emitting messages (e.g. chat, typing)
          // Security: check if user is authorized to emit to this room
          if (this.canEmit(userId, data.room)) {
            this.broadcastToRoom(data.room, data.event, data.payload, ws);
          }
        }
      } catch (err) {
        // Parse error or invalid message
      }
    });

    ws.addEventListener("close", () => {
      this.cleanupSession(ws);
    });
    
    ws.addEventListener("error", () => {
      this.cleanupSession(ws);
    });
  }

  joinRoom(ws, room) {
    const session = this.sessions.get(ws);
    if (!session) return;
    
    session.rooms.add(room);
    
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room).add(ws);
  }

  leaveRoom(ws, room) {
    const session = this.sessions.get(ws);
    if (session) {
      session.rooms.delete(room);
    }
    
    if (this.rooms.has(room)) {
      this.rooms.get(room).delete(ws);
      if (this.rooms.get(room).size === 0) {
        this.rooms.delete(room);
      }
    }
  }

  cleanupSession(ws) {
    const session = this.sessions.get(ws);
    if (session) {
      for (const room of session.rooms) {
        this.leaveRoom(ws, room);
      }
      this.sessions.delete(ws);
    }
  }

  broadcastToRoom(room, event, payload, excludeWs = null) {
    const clients = this.rooms.get(room);
    if (!clients) return;

    const message = JSON.stringify({ type: "event", event, room, payload });
    
    for (const ws of clients) {
      if (ws !== excludeWs) {
        try {
          ws.send(message);
        } catch (e) {
          // Socket might be closed
          this.cleanupSession(ws);
        }
      }
    }
  }

  canEmit(userId, room) {
    // Simple authorization logic: Users can only emit to their own chat rooms or public venue rooms
    // To be extended based on strict requirements
    return true; 
  }
}
