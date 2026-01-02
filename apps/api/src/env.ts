export const env = {
  port: Number(process.env.PORT ?? 4001),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtIssuer: process.env.JWT_ISSUER ?? "opsdesk-admin-demo",
  jwtAudience: process.env.JWT_AUDIENCE ?? "opsdesk-admin",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000"
};

