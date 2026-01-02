"use client";

import { useMemo, useState } from "react";

type LoginResponse = { token: string };

export default function Home() {
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4001",
    []
  );

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change-me-please");
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  async function login() {
    setMessage("");
    const res = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      setMessage("Login failed (demo). Register a user first via API.");
      return;
    }
    const json = (await res.json()) as LoginResponse;
    setToken(json.token);
    setMessage("Logged in. Token stored in memory (demo).");
  }

  return (
    <main>
      <h1>OpsDesk Admin (Demo)</h1>
      <p>
        This UI is intentionally minimal—focus is on architecture and secure
        backend patterns.
      </p>

      <section style={{ marginTop: 16 }}>
        <h2>Login</h2>
        <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          <button onClick={login} style={{ padding: 10 }}>
            Login
          </button>
          {message ? <div>{message}</div> : null}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Token (demo)</h2>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {token ?? "Not logged in"}
        </pre>
      </section>
    </main>
  );
}

