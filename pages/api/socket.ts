import type { NextApiRequest } from "next";
type IOServer = any;
type Socket = any;

// tiny cookie parser (no dep)
function parseCookie(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(";").forEach((p) => {
    const [k, ...rest] = p.split("=");
    if (!k) return;
    out[k.trim()] = decodeURIComponent(rest.join("=").trim() || "");
  });
  return out;
}

type NextApiResponseWithSocket = {
  socket: any & { server: any & { io?: IOServer } };
} & any;

export const config = { api: { bodyParser: false } };

export default async function handler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    // Lazy-init a single Socket.IO server per instance
    const { Server } = await import("socket.io");
    const io: IOServer = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
    });
    res.socket.server.io = io;

    io.on("connection", async (socket: Socket) => {
      // 1) Join per-device room (anonymous readers)
      const cookieStr = socket.request?.headers?.cookie as string | undefined;
      const cookies = parseCookie(cookieStr);
      const did = (socket.handshake.query?.did as string) || cookies["wn_did"];
      if (did) {
        socket.join(`device:${did}`);
      }

      // 2) If authenticated, also join per-user room (newsroom staff)
      try {
        // next-auth JWT verification via dynamic import
        const { getToken } = await import("next-auth/jwt");
        const fakeReq = { headers: { cookie: cookieStr || "" } };
        const token = await getToken({ req: fakeReq, secret: process.env.NEXTAUTH_SECRET });
        const userId = token?.sub || token?.id;
        if (userId) {
          socket.join(`user:${userId}`);
        }
      } catch {
        // ignore auth errors; device room still works
      }

      socket.emit("hello", { ok: true });

      // Optional: client may explicitly request joining rooms again
      socket.on("join", (payload: any) => {
        if (payload?.deviceId) socket.join(`device:${payload.deviceId}`);
        // never trust client userId here; we only join user rooms after server-side validation above
      });
    });
  }
  res.end();
}

