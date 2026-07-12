"use client";
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { RealtimeClient } from "../lib/realtime";

interface RealtimeContextType {
  client: RealtimeClient | null;
  status: "connecting" | "connected" | "reconnecting" | "offline";
}

const RealtimeContext = createContext<RealtimeContextType>({
  client: null,
  status: "offline",
});

export const RealtimeProvider = ({ 
  children, 
  token,
  url = process.env.NEXT_PUBLIC_REALTIME_URL || "ws://localhost:5005/api/realtime"
}: { 
  children: ReactNode, 
  token: string | null,
  url?: string 
}) => {
  const [status, setStatus] = useState<"connecting" | "connected" | "reconnecting" | "offline">("offline");
  const [client, setClient] = useState<RealtimeClient | null>(null);

  useEffect(() => {
    if (!token) {
      if (client) {
        client.disconnect();
        setTimeout(() => setClient(null), 0);
      }
      return;
    }

    const wsUrl = url.replace("http", "ws");
    const newClient = new RealtimeClient(wsUrl, token, setStatus);
    setClient(newClient);
    newClient.connect();

    return () => {
      newClient.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, url]);

  return (
    <RealtimeContext.Provider value={{ client, status }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscribe = (event: string, callback: (payload: any) => void) => {
    if (!context.client) return () => {};
    return context.client.subscribe(event, callback);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emit = (event: string, room: string, payload: any) => {
    if (!context.client) return;
    context.client.emit(event, room, payload);
  };

  const joinRoom = (room: string) => {
    if (!context.client) return;
    context.client.joinRoom(room);
  };

  const leaveRoom = (room: string) => {
    if (!context.client) return;
    context.client.leaveRoom(room);
  };

  return {
    status: context.status,
    subscribe,
    emit,
    joinRoom,
    leaveRoom,
  };
};
