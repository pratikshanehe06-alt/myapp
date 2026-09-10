import { useParams, Link } from "react-router-dom";

const MODULE_NAMES: Record<string, string> = {
  ems: "Energy & Emissions Management (EEMS)",
  alarms: "Alarm & Event Framework",
  audit: "Audit & Compliance",
  oee: "OEE / APS",
  "ai-copilot": "AI Copilot",
  reporting: "Reporting & Forecasting",
};

export default function ComingSoon() {
  const { moduleKey } = useParams();
  const name = MODULE_NAMES[moduleKey || ""] || "This module";

  return (
    <div style={{ maxWidth: "480px" }}>
      <h2>{name}</h2>
      <div className="panel">
        <p style={{ color: "#6B7785" }}>
          This module is on the CoreOT platform roadmap and will reuse the
          same Asset Registry, Telemetry Platform, and RBAC foundation
          already running in this demo — no separate application, per the
          platform's core architecture principle.
        </p>
        <Link to="/dashboard" className="back-link" style={{ marginTop: "1rem", display: "inline-block" }}>
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
