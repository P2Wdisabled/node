import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import twig from "twig";
import { prisma } from "./utils/prisma.js";
import {
  formatMessage,
  validateNickname,
  validateMessage,
  calculateMessageLimit,
} from "./utils/validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Static
app.use(express.static(path.join(__dirname, "public")));

// Twig (dossier 'views')
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.engine("twig", twig.__express);

// Route principale
app.get("/", (req, res) => {
  res.render("index", { title: "Chat Anonyme" });
});

// API Routes
export const setupApiRoutes = (app) => {
  // Historique (REST)
  app.get("/api/messages", async (req, res) => {
    try {
      const limit = calculateMessageLimit(req.query.limit);
      const rows = await prisma.message.findMany({
        orderBy: { ts: "asc" },
        take: limit,
      });
      res.json(rows.map(formatMessage));
    } catch (e) {
      console.error("GET /api/messages", e);
      res.status(500).json({ error: "history_failed" });
    }
  });
};

// Socket.IO Handlers
export const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 connect:", socket.id);
    let name = null;

    socket.on("join", (nick, ack) => {
      name = validateNickname(nick);
      socket.data.name = name;
      console.log("✅ join:", socket.id, "->", name);

      if (typeof ack === "function") ack({ ok: true, name });

      socket.emit("system", `Bienvenue ${name}`);
      socket.broadcast.emit("system", `${name} a rejoint le chat`);
    });

    socket.on("chat", async (raw) => {
      if (!name) return;
      const text = validateMessage(raw);
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
};

export default app;
