import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiClient.post("/auth/signup", { email, password, full_name: fullName });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">CoreOT</div>
        <div className="auth-subtitle">Create your account</div>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={{ color: "var(--state-fault)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>}
          {success && <p style={{ color: "var(--state-running)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>Account created! Redirecting...</p>}
          <button type="submit" className="auth-btn-primary">Sign Up</button>
        </form>
        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
