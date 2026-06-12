"use client";

import { useState, useEffect } from "react";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("daphne-auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "daphne") {
      setIsAuthenticated(true);
      localStorage.setItem("daphne-auth", "true");
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--peach)", padding: 24 }}>
      <form onSubmit={handleLogin} className="card" style={{ padding: 40, maxWidth: 400, width: "100%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "2rem", color: "var(--text)", marginBottom: 8 }}>
          Welcome
        </h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "var(--text-muted)", marginBottom: 24 }}>
          Please enter the password to view the portfolio.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: `2px solid ${error ? "var(--coral-dark)" : "var(--border)"}`,
            fontFamily: "'Nunito', sans-serif",
            fontSize: "1rem",
            outline: "none",
            marginBottom: 16,
            background: "white"
          }}
        />
        {error && <p style={{ color: "var(--coral-dark)", fontSize: "0.85rem", marginTop: -8, marginBottom: 16 }}>Incorrect password.</p>}
        <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Unlock
        </button>
      </form>
    </div>
  );
}
