import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>CoreOT</h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>
        Industrial IoT & Asset Performance Management Platform
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/login" style={{ padding: "0.75rem 1.5rem", background: "#1a1a2e", color: "white", borderRadius: "6px", textDecoration: "none" }}>
          Sign In
        </Link>
        <Link to="/signup" style={{ padding: "0.75rem 1.5rem", border: "1px solid #1a1a2e", color: "#1a1a2e", borderRadius: "6px", textDecoration: "none" }}>
          Create Account
        </Link>
      </div>
    </div>
  );
}
