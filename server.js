/* server.js */
const path = require("path");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const { Server } = require("socket.io");
const twig = require("twig");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Logs et assets
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Twig
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.engine("twig", twig.__express);

// Route principale
app.get("/", (req, res) => {
  res.render("index", { title: "Mini Chat" });
});

// Socket.IO
io.on("connection", (socket) => {
  socket.on("join", (raw) => {
    let name =
      String(raw || "")
        .trim()
        .slice(0, 32) || "Guest";
    socket.data.name = name;
    socket.emit("system", `Bienvenue ${name} !`);
    socket.broadcast.emit("system", `${name} a rejoint le chat.`);
  });

  socket.on("chat", (raw) => {
    const name = socket.data.name || "Anonyme";
    const text = String(raw || "")
      .slice(0, 1000)
      .trim();
    if (!text) return;
    io.emit("chat", { name, text, ts: Date.now() });
  });

  socket.on("disconnect", () => {
    if (socket.data.name) {
      io.emit("system", `${socket.data.name} a quitté le chat.`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ http://localhost:${PORT}`);
});
