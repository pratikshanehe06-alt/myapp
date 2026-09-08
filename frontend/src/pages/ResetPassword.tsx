import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../api/client";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiClient.post("/auth/reset-password", { token, new_password: newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Reset failed");
    }
  };

  return (
    <div style={{ maxWidth: "360px", margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem" }} />
        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
        {success && <p style={{ color: "green", fontSize: "0.9rem" }}>Password reset! Redirecting to login...</p>}
        <button type="submit" style={{ width: "100%", padding: "0.6rem", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px" }}>
          Reset Password
        </button>
      </form>
    </div>
  );
}
