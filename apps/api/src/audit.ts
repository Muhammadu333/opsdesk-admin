import { pool } from "./db.js";

export async function writeAuditEvent(input: {
  actorUserId?: string | null;
  action: string;
  target?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const { actorUserId, action, target, metadata } = input;
  await pool.query(
    "insert into audit_log (actor_user_id, action, target, metadata) values ($1, $2, $3, $4)",
    [actorUserId ?? null, action, target ?? null, metadata ?? {}]
  );
}

