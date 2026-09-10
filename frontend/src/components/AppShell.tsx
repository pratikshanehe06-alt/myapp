import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { getCurrentTenant } from "../api/tenants";

const MODULE_LABELS: Record<string, string> = {
  apm: "APM",
  ems: "EMS",
  alarms: "Alarms & Events",
  audit: "Audit & Compliance",
  oee: "OEE / APS",
  "ai-copilot": "AI Copilot",
  reporting: "Reporting & Forecasting",
};
const ALL_MODULE_KEYS = Object.keys(MODULE_LABELS);

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enabledModules, setEnabledModules] = useState<string[]>(["apm"]);

  useEffect(() => {
    getCurrentTenant()
      .then((t) => setEnabledModules(t.enabled_modules.length ? t.enabled_modules : ["apm"]))
      .catch(() => setEnabledModules(["apm"]));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const modulePath = (key: string, isEnabled: boolean) =>
    key === "apm" && isEnabled ? "/dashboard" : `/coming-soon/${key}`;

  return (
    <div className="coreot-shell">
      <nav className="coreot-sidebar">
        <div className="coreot-sidebar-brand">CoreOT</div>

        <Link to="/admin/tenants" className={`coreot-nav-link ${isActive("/admin") ? "active" : ""}`}>
          Super Admin
        </Link>
        <Link to="/plants" className={`coreot-nav-link ${isActive("/plants") ? "active" : ""}`}>
          Plants & Areas
        </Link>
        <Link to="/employees" className={`coreot-nav-link ${isActive("/employees") ? "active" : ""}`}>
          Employees
        </Link>

        <div style={{ marginTop: "1.5rem", marginBottom: "0.5rem", paddingLeft: "0.6rem", fontSize: "0.7rem", letterSpacing: "0.05em", color: "#5A6B7D", textTransform: "uppercase" }}>
          Modules
        </div>
        {ALL_MODULE_KEYS.map((key) => {
          const isEnabled = enabledModules.includes(key);
          const path = modulePath(key, isEnabled);
          return (
            <Link
              key={key}
              to={path}
              className={`coreot-nav-link ${isActive(path) ? "active" : ""}`}
              style={isEnabled ? {} : { opacity: 0.5, fontSize: "0.85rem" }}
            >
              {MODULE_LABELS[key]}
              {!isEnabled && <span style={{ fontSize: "0.65rem", marginLeft: "0.4rem", color: "#5A6B7D" }}>(not enabled)</span>}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          style={{ marginTop: "2rem", background: "none", border: "1px solid #3A4A5E", color: "#8A98A8", padding: "0.4rem 0.6rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", width: "100%" }}
        >
          Log out
        </button>
      </nav>
      <main className="coreot-main">
        <Outlet />
      </main>
    </div>
  );
}
