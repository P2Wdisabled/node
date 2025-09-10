import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import twig from "twig";

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

export default app;
