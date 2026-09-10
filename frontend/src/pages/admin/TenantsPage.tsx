import { useEffect, useState } from "react";
import { getTenants, createTenant, updateTenant, deleteTenant } from "../../api/tenants";
import type { Tenant } from "../../api/tenants";

const ALL_MODULES = ["apm", "ems", "alarms", "audit", "oee", "ai-copilot", "reporting"];

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [modules, setModules] = useState<string[]>(["apm"]);

  const load = async () => {
    try {
      setTenants(await getTenants());
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load tenants.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleModule = (m: string) => {
    setModules((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createTenant({
        name,
        slug,
        enabled_modules: modules,
        admin_email: adminEmail,
        admin_password: adminPassword,
      });
      setName("");
      setSlug("");
      setAdminEmail("");
      setAdminPassword("");
      setModules(["apm"]);
      load();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create tenant.");
    }
  };

  const handleToggleModuleOnTenant = async (tenant: Tenant, m: string) => {
    const newModules = tenant.enabled_modules.includes(m)
      ? tenant.enabled_modules.filter((x) => x !== m)
      : [...tenant.enabled_modules, m];
    await updateTenant(tenant.id, { enabled_modules: newModules });
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteTenant(id);
    load();
  };

  return (
    <div>
      <h2>Tenants (Companies)</h2>
      {error && <p style={{ color: "var(--state-fault)" }}>{error}</p>}

      <div className="panel">
        <div className="panel-title">Create New Tenant + First Tenant Admin</div>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "420px" }}>
          <input className="input-field" placeholder="Company name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input-field" placeholder="Slug (e.g. acme-mfg)" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <input className="input-field" type="email" placeholder="Admin email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
          <input className="input-field" type="password" placeholder="Admin temporary password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
          <div>
            <div style={{ fontSize: "0.8rem", color: "#6B7785", marginBottom: "0.3rem" }}>Enabled modules:</div>
            {ALL_MODULES.map((m) => (
              <label key={m} style={{ marginRight: "0.75rem", fontSize: "0.85rem" }}>
                <input type="checkbox" checked={modules.includes(m)} onChange={() => toggleModule(m)} /> {m}
              </label>
            ))}
          </div>
          <button type="submit" className="btn-primary" style={{ width: "160px" }}>Create Tenant</button>
        </form>
      </div>

      {tenants.map((t) => (
        <div className="panel" key={t.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <strong>{t.name}</strong>
            <button onClick={() => handleDelete(t.id)} style={{ color: "var(--state-fault)", border: "none", background: "none", cursor: "pointer" }}>
              Delete
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8A98A8", marginBottom: "0.5rem" }}>{t.slug}</div>
          {ALL_MODULES.map((m) => (
            <label key={m} style={{ marginRight: "0.75rem", fontSize: "0.85rem" }}>
              <input type="checkbox" checked={t.enabled_modules.includes(m)} onChange={() => handleToggleModuleOnTenant(t, m)} /> {m}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
