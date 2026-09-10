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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">CoreOT</div>
        <div className="auth-subtitle">Set a new password</div>
        <form onSubmit={handleSubmit}>
          <input className="auth-input" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          {error && <p style={{ color: "var(--state-fault)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>}
          {success && <p style={{ color: "var(--state-running)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>Password reset! Redirecting...</p>}
          <button type="submit" className="auth-btn-primary">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
