import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pino from "pino-http";
import { env } from "./env.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import meRoutes from "./routes/me.js";
import auditRoutes from "./routes/audit.js";

if (!env.databaseUrl) throw new Error("DATABASE_URL is required");
if (!env.jwtSecret || env.jwtSecret.length < 24)
  throw new Error("JWT_SECRET must be set to a long random value");

const app = express();

app.disable("x-powered-by");
app.use(
  pino({
    redact: ["req.headers.authorization"]
  })
);
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "200kb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

const authLimiter = rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false });
app.use("/auth", authLimiter);
app.use("/auth", authRoutes);

app.use("/me", meRoutes);
app.use("/admin", adminRoutes);
app.use("/audit", auditRoutes);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`opsdesk-api listening on :${env.port}`);
});

