import { useEffect, useRef, useState } from "react";

type CountPayload = { count: number };
type NewNotification = { id: string; title?: string; body?: string; createdAt?: string };

export function useNotificationsSocket() {
  const [connected, setConnected] = useState(false);
  const [unread, setUnread] = useState<number | null>(null);
  const seenRef = useRef<Set<string>>(new Set());
  const ioRef = useRef<any>(null);

  function uuid() {
    // RFC4122-ish, lightweight
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getOrSetDeviceId(): string {
    // prefer cookie so server can read it without extra calls
    const match = document.cookie.match(/(?:^|; )wn_did=([^;]+)/);
    if (match?.[1]) return decodeURIComponent(match[1]);
    const id = uuid();
    // 400 days cookie (approx); secure flags omitted for Render HTTP local; add SameSite/secure in prod if on HTTPS
    document.cookie = `wn_did=${encodeURIComponent(id)}; Max-Age=${60 * 60 * 24 * 400}; Path=/`;
    return id;
  }

  useEffect(() => {
    let cancelled = false;
    async function ensureServer() {
      // Ensure the server route is initialized (no-op after first call)
      try {
        await fetch("/api/socket");
      } catch {}
      if (cancelled) return;
      const did = getOrSetDeviceId();
      const { io } = await import("socket.io-client");
      const client = io({
        path: "/api/socket",
        query: { did },
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

      // Redundant safety: explicitly join device room after connect (server already did this via query/cookie)
      client.emit("join", { deviceId: did });
    }
    ensureServer();
    return () => {
      cancelled = true;
      ioRef.current?.close?.();
    };
  }, []);

  return { connected, unread, setUnread };
}

