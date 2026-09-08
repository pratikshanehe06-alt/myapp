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
    <div style={{ maxWidth: "360px", margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem" }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem" }} />
        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
        {success && <p style={{ color: "green", fontSize: "0.9rem" }}>Account created! Redirecting...</p>}
        <button type="submit" style={{ width: "100%", padding: "0.6rem", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px" }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
