import { useEffect, useState } from "react";
import { getSites, createSite, deleteSite, getAreas, createArea, deleteArea } from "../api/org";
import type { Site, Area } from "../api/org";

export default function PlantsPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [areasBySite, setAreasBySite] = useState<Record<number, Area[]>>({});
  const [error, setError] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [areaName, setAreaName] = useState<Record<number, string>>({});

  const load = async () => {
    try {
      const s = await getSites();
      setSites(s);
      const areaEntries = await Promise.all(s.map((site) => getAreas(site.id).then((a) => [site.id, a] as const)));
      setAreasBySite(Object.fromEntries(areaEntries));
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load plants. You may not have plant management permission yet.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) return;
    await createSite({ name: siteName, location: siteLocation });
    setSiteName("");
    setSiteLocation("");
    load();
  };

  const handleAddArea = async (siteId: number) => {
    const name = areaName[siteId];
    if (!name?.trim()) return;
    await createArea({ site_id: siteId, name });
    setAreaName((prev) => ({ ...prev, [siteId]: "" }));
    load();
  };

  const handleDeleteSite = async (siteId: number) => {
    await deleteSite(siteId);
    load();
  };

  const handleDeleteArea = async (areaId: number) => {
    await deleteArea(areaId);
    load();
  };

  return (
    <div>
      <h2>Plants & Areas</h2>
      {error && <p style={{ color: "var(--state-fault)" }}>{error}</p>}

      <div className="panel">
        <div className="panel-title">Add Plant / Site</div>
        <form onSubmit={handleAddSite} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input className="input-field" style={{ width: "200px" }} placeholder="Site name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          <input className="input-field" style={{ width: "200px" }} placeholder="Location" value={siteLocation} onChange={(e) => setSiteLocation(e.target.value)} />
          <button type="submit" className="btn-primary">Add Site</button>
        </form>
      </div>

      {sites.map((site) => (
        <div className="panel" key={site.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{site.name}</strong>
            <button onClick={() => handleDeleteSite(site.id)} style={{ color: "var(--state-fault)", border: "none", background: "none", cursor: "pointer" }}>
              Delete Site
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8A98A8", marginBottom: "0.75rem" }}>{site.location}</div>

          {(areasBySite[site.id] || []).map((area) => (
            <div key={area.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid #F0F2F4", fontSize: "0.85rem" }}>
              <span>{area.name}</span>
              <button onClick={() => handleDeleteArea(area.id)} style={{ color: "var(--state-fault)", border: "none", background: "none", cursor: "pointer", fontSize: "0.8rem" }}>
                Remove
              </button>
            </div>
          ))}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <input
              className="input-field"
              placeholder="New area name"
              value={areaName[site.id] || ""}
              onChange={(e) => setAreaName((prev) => ({ ...prev, [site.id]: e.target.value }))}
            />
            <button className="btn-primary" onClick={() => handleAddArea(site.id)}>Add Area</button>
          </div>
        </div>
      ))}
    </div>
  );
}
