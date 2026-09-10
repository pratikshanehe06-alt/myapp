import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAsset } from "../api/assets";
import type { Asset } from "../api/assets";
import { getLatestReadings } from "../api/telemetry";
import type { LatestReading } from "../api/telemetry";
import { getAssetsHealth } from "../api/apm";
import type { AssetHealth } from "../api/apm";

export default function AssetDetail() {
  const { id } = useParams();
  const assetId = Number(id);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [readings, setReadings] = useState<LatestReading[]>([]);
  const [health, setHealth] = useState<AssetHealth | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [a, r, healthList] = await Promise.all([
        getAsset(assetId),
        getLatestReadings(assetId),
        getAssetsHealth(),
      ]);
      setAsset(a);
      setReadings(r);
      setHealth(healthList.find((h) => h.asset_id === assetId) || null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load asset.");
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [assetId]);

  if (error) return <p style={{ color: "var(--state-fault)" }}>{error}</p>;
  if (!asset) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/dashboard" className="back-link">← Back to dashboard</Link>

      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ margin: 0 }}>{asset.name}</h2>
            <p style={{ color: "#8A98A8", margin: "0.25rem 0 0" }}>
              {asset.asset_code} · {asset.asset_type} · {asset.manufacturer || "—"}
            </p>
          </div>
          <span className={`state-badge ${asset.status}`}>
            <span className="state-dot"></span>
            {asset.status}
          </span>
        </div>
        {health && (
          <div style={{ marginTop: "1rem" }}>
            <span className="health-bar-track">
              <span
                className="health-bar-fill"
                style={{
                  width: `${health.health_score}%`,
                  background: health.health_score >= 80 ? "var(--state-running)" : health.health_score >= 50 ? "var(--state-idle)" : "var(--state-fault)",
                }}
              ></span>
            </span>
            <span className="data-value">{health.health_score}% health</span>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-title">Live Parameters</div>
        <div className="readings-grid">
          {readings.length === 0 && <div className="reading-cell">No readings yet — simulator may still be starting.</div>}
          {readings.map((r) => (
            <div className="reading-cell" key={r.tag_id}>
              <div className="reading-label">{r.tag_name}</div>
              <div>
                <span className="reading-value data-value">{r.value}</span>
                <span className="reading-unit">{r.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
