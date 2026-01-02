import type { RequestHandler } from "express";
import { verifyAccessToken, type JwtUser } from "./jwt.js";

declare global {
  // eslint-disable-next-line no-var
  var __opsdesk_global_types__: true | undefined;
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "unauthorized" });

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
};

export function requireRole(roles: JwtUser["role"][]): RequestHandler {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "forbidden" });
    return next();
  };
}

