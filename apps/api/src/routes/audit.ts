import { Router } from "express";
import { requireAuth, requireRole } from "../security/rbac.js";
import { pool } from "../db.js";

const router = Router();

router.get("/", requireAuth, requireRole(["admin", "manager"]), async (_req, res) => {
  const result = await pool.query(
    "select id, actor_user_id, action, target, metadata, created_at from audit_log order by created_at desc limit 100"
  );
  return res.json({ events: result.rows });
});

export default router;

