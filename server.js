import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app, { setupApiRoutes, setupSocketHandlers } from "./app.js";

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

// Setup routes and handlers
setupApiRoutes(app);
setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
