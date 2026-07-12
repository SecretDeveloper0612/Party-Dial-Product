"use client";
import React, { useEffect } from "react";
import { RealtimeProvider, useRealtime } from "../shared/hooks/useRealtime";

export const ConnectionIndicator = () => {
  const { status } = useRealtime();

  const getStatusDisplay = () => {
    switch (status) {
      case "connected":
        return { label: "Live", color: "bg-emerald-500", text: "text-emerald-700", ring: "ring-emerald-500/30" };
      case "connecting":
      case "reconnecting":
        return { label: "Reconnecting...", color: "bg-amber-500 animate-pulse", text: "text-amber-700", ring: "ring-amber-500/30" };
      case "offline":
      default:
        return { label: "Offline", color: "bg-rose-500", text: "text-rose-700", ring: "ring-rose-500/30" };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm ring-1 ${display.ring}`}>
      <span className="relative flex h-2.5 w-2.5">
        {status === "connected" && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${display.color}`}></span>}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${display.color}`}></span>
      </span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${display.text}`}>
        {display.label}
      </span>
    </div>
  );
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { subscribe } = useRealtime();

  useEffect(() => {
    const unsubscribeNewLead = subscribe("new-lead", (payload) => {
      // Create and dispatch a toast event, or play a sound
      console.log("🔔 New Lead Received:", payload);
      try {
        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => console.log("Audio playback failed (interaction required)"));
      } catch (err) {}
      // In a real app we'd integrate with Sonner or react-hot-toast here
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("toast", { 
          detail: { type: "success", title: "New Lead!", message: `${payload.customerName} sent an enquiry for ${payload.eventType}` }
        }));
      }
    });

    const unsubscribeDashboard = subscribe("dashboard-update", (payload) => {
      console.log("🔄 Dashboard Update:", payload);
    });

    return () => {
      unsubscribeNewLead();
      unsubscribeDashboard();
    };
  }, [subscribe]);

  return <>{children}</>;
};

export const RealtimeAppWrapper = ({ children }: { children: React.ReactNode }) => {
  // In a real app, you'd get this token from your Auth Provider / Appwrite session
  // We'll mock it for now, assuming the login flow sets localStorage or a cookie.
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    // Attempt to read Appwrite JWT from localStorage or cookie.
    // Replace with real Appwrite SDK logic (e.g. account.createJWT())
    const jwt = localStorage.getItem("appwrite_jwt");
    if (jwt && jwt !== token) {
      // Small timeout to prevent React 18 synchronous cascading render warning
      setTimeout(() => setToken(jwt), 0);
    }
  }, [token]);

  return (
    <RealtimeProvider token={token}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </RealtimeProvider>
  );
};
