import jwt from "jsonwebtoken";
import { env } from "../env.js";

export type JwtUser = {
  sub: string;
  email: string;
  role: "admin" | "manager" | "support";
};

export function signAccessToken(user: JwtUser): string {
  return jwt.sign(user, env.jwtSecret, {
    algorithm: "HS256",
    expiresIn: "20m",
    issuer: env.jwtIssuer,
    audience: env.jwtAudience
  });
}

export function verifyAccessToken(token: string): JwtUser {
  return jwt.verify(token, env.jwtSecret, {
    algorithms: ["HS256"],
    issuer: env.jwtIssuer,
    audience: env.jwtAudience
  }) as JwtUser;
}

