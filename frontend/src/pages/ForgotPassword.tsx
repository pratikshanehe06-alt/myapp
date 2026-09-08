import { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiClient.post("/auth/forgot-password", { email });
    setMessage(res.data.message);
  };

  return (
    <div style={{ maxWidth: "360px", margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem" }} />
        <button type="submit" style={{ width: "100%", padding: "0.6rem", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px" }}>
          Send Reset Link
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>{message}</p>}
      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        <Link to="/login">Back to sign in</Link>
      </p>
    </div>
  );
}
