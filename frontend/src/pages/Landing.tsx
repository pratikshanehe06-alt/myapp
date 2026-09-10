import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center", maxWidth: "440px" }}>
        <div className="auth-brand" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>CoreOT</div>
        <p className="auth-subtitle" style={{ marginBottom: "2rem" }}>
          Industrial IoT & Asset Performance Management Platform
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <Link to="/login" className="auth-btn-primary" style={{ textDecoration: "none", display: "inline-block", width: "auto", padding: "0.65rem 1.5rem" }}>
            Sign In
          </Link>
          <Link
            to="/signup"
            style={{ padding: "0.65rem 1.5rem", border: "1px solid var(--coreot-accent)", color: "var(--coreot-accent)", borderRadius: "6px", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
