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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">CoreOT</div>
        <div className="auth-subtitle">Reset your password</div>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" className="auth-btn-primary">Send Reset Link</button>
        </form>
        {message && <p style={{ fontSize: "0.85rem", color: "#6B7785", marginTop: "1rem" }}>{message}</p>}
        <p className="auth-footer-text">
          <Link to="/login" className="auth-link">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
