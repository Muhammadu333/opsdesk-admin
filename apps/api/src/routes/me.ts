import { Router } from "express";
import { requireAuth } from "../security/rbac.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

export default router;

