import type { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

type NextApiResponseWithSocket = {
  socket: NetSocket & { server: HTTPServer & { io?: IOServer } };
} & any;

export const config = { api: { bodyParser: false } };

export default function handler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    // Lazy-init a single Socket.IO server per instance
    const { Server } = require("socket.io");
    const io: IOServer = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      // Optionally join per-user rooms later: socket.join(`user:${userId}`)
      socket.emit("hello", { ok: true });
    });
  }
  res.end();
}

