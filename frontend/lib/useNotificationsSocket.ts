import { useEffect, useRef, useState } from "react";

type CountPayload = { count: number };
type NewNotification = { id: string; title?: string; body?: string; createdAt?: string };

export function useNotificationsSocket() {
  const [connected, setConnected] = useState(false);
  const [unread, setUnread] = useState<number | null>(null);
  const seenRef = useRef<Set<string>>(new Set());
  const ioRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function ensureServer() {
      // Ensure the server route is initialized (no-op after first call)
      try {
        await fetch("/api/socket");
      } catch {}
      if (cancelled) return;
      const { io } = await import("socket.io-client");
      const client = io({
        path: "/api/socket",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        reconnectionDelayMax: 5000,
      });
      ioRef.current = client;
      client.on("connect", () => setConnected(true));
      client.on("disconnect", () => setConnected(false));

      client.on("notification:count", (p: CountPayload) => {
        if (typeof p?.count === "number") setUnread(p.count);
      });
      client.on("notification:new", (n: NewNotification) => {
        if (n?.id && !seenRef.current.has(n.id)) {
          seenRef.current.add(n.id);
          setUnread((c) => (c == null ? 1 : c + 1));
        }
      });
    }
    ensureServer();
    return () => {
      cancelled = true;
      ioRef.current?.close?.();
    };
  }, []);

  return { connected, unread, setUnread };
}

