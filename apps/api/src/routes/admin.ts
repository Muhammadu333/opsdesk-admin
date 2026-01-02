import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAuth, requireRole } from "../security/rbac.js";
import { writeAuditEvent } from "../audit.js";

const router = Router();

router.get("/users", requireAuth, requireRole(["admin"]), async (_req, res) => {
  const result = await pool.query("select id, email, role, created_at from users order by created_at desc");
  return res.json({ users: result.rows });
});

const roleSchema = z.object({ role: z.enum(["admin", "manager", "support"]) });

router.post(
  "/users/:id/role",
  requireAuth,
  requireRole(["admin"]),
  async (req, res) => {
    const parsed = roleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "invalid_input" });

    const userId = req.params.id;
    const result = await pool.query(
      "update users set role = $1 where id = $2 returning id, email, role",
      [parsed.data.role, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "not_found" });

    await writeAuditEvent({
      actorUserId: req.user?.sub ?? null,
      action: "role_changed",
      target: `user:${userId}`,
      metadata: { newRole: parsed.data.role }
    });

    return res.json({ user: result.rows[0] });
  }
);

export default router;

