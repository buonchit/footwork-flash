import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath, { maxAge: "1y", index: false }));

app.get("/api/random", (_req, res) => {
  const pos = [1,2,3,4,5,6,7,8];
  res.json({ position: pos[Math.floor(Math.random()*pos.length)], ts: Date.now() });
});

app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));

app.listen(PORT, () => {
  console.log(`✅ Express server started on port ${PORT}`);
});