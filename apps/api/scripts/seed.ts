import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { pool } from "../src/db.js";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

async function main() {
  const email = requiredEnv("SEED_ADMIN_EMAIL").toLowerCase();
  const password = requiredEnv("SEED_ADMIN_PASSWORD");
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `insert into users (email, password_hash, role)
     values ($1, $2, 'admin')
     on conflict (email) do nothing`,
    [email, passwordHash]
  );

  // eslint-disable-next-line no-console
  console.log(`Seeded admin user (if missing): ${email}`);
  await pool.end();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

