import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlantSummary, getAssetsHealth } from "../api/apm";
import type { PlantSummary, AssetHealth } from "../api/apm";
import { getAssets } from "../api/assets";
import type { Asset } from "../api/assets";

function healthColor(score: number) {
  if (score >= 80) return "var(--state-running)";
  if (score >= 50) return "var(--state-idle)";
  return "var(--state-fault)";
}

export default function PlantDashboard() {
  const [summary, setSummary] = useState<PlantSummary | null>(null);
  const [health, setHealth] = useState<AssetHealth[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [s, h, a] = await Promise.all([getPlantSummary(), getAssetsHealth(), getAssets()]);
      setSummary(s);
      setHealth(h);
      setAssets(a);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000); // refresh alongside the 10s simulator cycle
    return () => clearInterval(interval);
  }, []);

  const healthByAssetId = new Map(health.map((h) => [h.asset_id, h]));

  return (
    <div>
      <h2 style={{ marginBottom: "0.25rem" }}>Plant A — Overview</h2>
      <p style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#6B7785" }}><span className="live-pulse-dot"></span>Live — updating every 10s</p>
      {error && <p style={{ color: "var(--state-fault)" }}>{error}</p>}

      {summary && (
        <div className="kpi-strip">
          <div className="kpi-cell"><div className="kpi-label">Total Assets</div><div className="kpi-value data-value">{summary.total_assets}</div></div>
          <div className="kpi-cell"><div className="kpi-label">Running</div><div className="kpi-value data-value accent">{summary.running}</div></div>
          <div className="kpi-cell"><div className="kpi-label">Idle</div><div className="kpi-value data-value warn">{summary.idle}</div></div>
          <div className="kpi-cell"><div className="kpi-label">Fault</div><div className="kpi-value data-value critical">{summary.fault}</div></div>
          <div className="kpi-cell"><div className="kpi-label">Avg Health</div><div className="kpi-value data-value">{summary.average_health}%</div></div>
          <div className="kpi-cell"><div className="kpi-label">Critical Assets</div><div className="kpi-value data-value critical">{summary.critical_assets}</div></div>
        </div>
      )}

      <table className="asset-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>State</th>
            <th>Health</th>
            <th>Criticality</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const h = healthByAssetId.get(asset.id);
            const score = h?.health_score ?? 100;
            return (
              <tr
                key={asset.id}
                className={`asset-row ${asset.status}`}
                onClick={() => navigate(`/assets/${asset.id}`)}
              >
                <td><strong>{asset.name}</strong><br /><span style={{ color: "#8A98A8", fontSize: "0.8rem" }}>{asset.asset_code}</span></td>
                <td>{asset.asset_type}</td>
                <td>
                  <span className={`state-badge ${asset.status}`}>
                    <span className="state-dot"></span>
                    {asset.status}
                  </span>
                </td>
                <td>
                  <span className="health-bar-track">
                    <span className="health-bar-fill" style={{ width: `${score}%`, background: healthColor(score) }}></span>
                  </span>
                  <span className="data-value">{score}%</span>
                </td>
                <td style={{ textTransform: "capitalize" }}>{asset.criticality}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
