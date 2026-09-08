import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "360px", margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem" }} />
        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: "0.6rem", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px" }}>
          Sign In
        </button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p style={{ fontSize: "0.9rem" }}>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
