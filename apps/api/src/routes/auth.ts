import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { signAccessToken } from "../security/jwt.js";
import { writeAuditEvent } from "../audit.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  role: z.enum(["admin", "manager", "support"]).default("support")
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });

  const { email, password, role } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const result = await pool.query(
      "insert into users (email, password_hash, role) values ($1, $2, $3) returning id, email, role",
      [email.toLowerCase(), passwordHash, role]
    );
    await writeAuditEvent({
      actorUserId: result.rows[0].id,
      action: "user_registered",
      target: `user:${result.rows[0].id}`
    });
    return res.status(201).json({ user: result.rows[0] });
  } catch {
    return res.status(409).json({ error: "email_in_use" });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });

  const { email, password } = parsed.data;
  const result = await pool.query(
    "select id, email, role, password_hash from users where email = $1",
    [email.toLowerCase()]
  );

  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: "invalid_credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  await writeAuditEvent({
    actorUserId: user.id,
    action: "login_success",
    target: `user:${user.id}`
  });

  return res.json({ token });
});

export default router;

