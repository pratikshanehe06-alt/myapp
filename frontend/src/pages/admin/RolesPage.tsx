import { useEffect, useState } from "react";
import { getRoles, getPermissions, createRole, updateRole, deleteRole } from "../../api/rbac";
import type { Role, Permission } from "../../api/rbac";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePerms, setNewRolePerms] = useState<number[]>([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [r, p] = await Promise.all([getRoles(), getPermissions()]);
      setRoles(r);
      setPermissions(p);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load roles.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const togglePerm = (id: number) => {
    setNewRolePerms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleCreate = async () => {
    if (!newRoleName.trim()) return;
    await createRole({ name: newRoleName, permission_ids: newRolePerms });
    setNewRoleName("");
    setNewRolePerms([]);
    loadData();
  };

  const handleToggleOnRole = async (role: Role, permId: number) => {
    const hasPerm = role.permissions.some((p) => p.id === permId);
    const newIds = hasPerm
      ? role.permissions.filter((p) => p.id !== permId).map((p) => p.id)
      : [...role.permissions.map((p) => p.id), permId];
    await updateRole(role.id, { permission_ids: newIds });
    loadData();
  };

  const handleDelete = async (roleId: number) => {
    await deleteRole(roleId);
    loadData();
  };

  return (
    <div>
      <h2>Roles & Permissions</h2>
      {error && <p style={{ color: "var(--state-fault)" }}>{error}</p>}

      <div className="panel">
        <div className="panel-title">Create New Role</div>
        <input
          className="input-field"
          style={{ marginBottom: "0.75rem" }}
          placeholder="Role name"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
        />
        <div style={{ marginBottom: "0.75rem" }}>
          {permissions.map((p) => (
            <label key={p.id} style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.15rem" }}>
              <input type="checkbox" checked={newRolePerms.includes(p.id)} onChange={() => togglePerm(p.id)} />{" "}
              {p.code} <span style={{ color: "#8A98A8" }}>({p.description})</span>
            </label>
          ))}
        </div>
        <button className="btn-primary" onClick={handleCreate}>Create Role</button>
      </div>

      {roles.map((role) => (
        <div className="panel" key={role.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <strong>
              {role.name}{" "}
              {role.is_system_role === "true" && <span style={{ fontSize: "0.75rem", color: "#8A98A8" }}>(system role)</span>}
            </strong>
            {role.is_system_role !== "true" && (
              <button onClick={() => handleDelete(role.id)} style={{ color: "var(--state-fault)", border: "none", background: "none", cursor: "pointer" }}>
                Delete
              </button>
            )}
          </div>
          {permissions.map((p) => {
            const checked = role.permissions.some((rp) => rp.id === p.id);
            return (
              <label key={p.id} style={{ display: "block", fontSize: "0.8rem" }}>
                <input type="checkbox" checked={checked} onChange={() => handleToggleOnRole(role, p.id)} /> {p.code}
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}
