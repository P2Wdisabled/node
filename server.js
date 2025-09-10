import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./utils/prisma.js";
import app from "./app.js";

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

// Historique (REST)
app.get("/api/messages", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 50), 200);
    const rows = await prisma.message.findMany({
      orderBy: { ts: "asc" },
      take: limit,
    });
    res.json(rows.map((r) => ({ ...r, ts: r.ts.toISOString() })));
  } catch (e) {
    console.error("GET /api/messages", e);
    res.status(500).json({ error: "history_failed" });
  }
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("🔌 connect:", socket.id);
  let name = null;

  socket.on("join", (nick, ack) => {
    name = String(nick ?? "")
      .trim()
      .slice(0, 32);
    if (!name) name = "Anonyme";
    socket.data.name = name;
    console.log("✅ join:", socket.id, "->", name);

    if (typeof ack === "function") ack({ ok: true, name });

    socket.emit("system", `Bienvenue ${name}`);
    socket.broadcast.emit("system", `${name} a rejoint le chat`);
  });

  socket.on("chat", async (raw) => {
    if (!name) return;
    const text = String(raw ?? "")
      .trim()
      .slice(0, 1000);
    if (!text) return;

    try {
      const saved = await prisma.message.create({ data: { name, text } });
      io.emit("chat", { name, text, ts: saved.ts.toISOString() });
    } catch (e) {
      console.error("chat save fail:", e);
      socket.emit("system", "Échec d'enregistrement du message.");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("👋 disconnect:", socket.id, reason);
    if (name) io.emit("system", `${name} a quitté`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
