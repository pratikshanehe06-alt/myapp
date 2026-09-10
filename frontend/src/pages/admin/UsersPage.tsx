import { useEffect, useState } from "react";
import { getUsers, getRoles, assignRoleToUser, removeRoleFromUser } from "../../api/rbac";
import type { UserWithRoles, Role } from "../../api/rbac";

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [u, r] = await Promise.all([getUsers(), getRoles()]);
      setUsers(u);
      setRoles(r);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load users.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (userId: number, roleId: number) => {
    if (!roleId) return;
    await assignRoleToUser(userId, roleId);
    loadData();
  };

  const handleRemove = async (userId: number, roleId: number) => {
    await removeRoleFromUser(userId, roleId);
    loadData();
  };

  return (
    <div>
      <h2>Users</h2>
      {error && <p style={{ color: "var(--state-fault)" }}>{error}</p>}
      <table className="asset-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Tenant ID</th>
            <th>Roles</th>
            <th>Assign Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.tenant_id ?? "—"}</td>
              <td>
                {u.roles.map((r) => (
                  <span
                    key={r.id}
                    style={{ display: "inline-block", background: "#F0F2F4", padding: "0.15rem 0.5rem", borderRadius: "4px", marginRight: "0.35rem", fontSize: "0.8rem" }}
                  >
                    {r.name}{" "}
                    <button onClick={() => handleRemove(u.id, r.id)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--state-fault)" }}>
                      ×
                    </button>
                  </span>
                ))}
              </td>
              <td>
                <select defaultValue="" onChange={(e) => handleAssign(u.id, Number(e.target.value))}>
                  <option value="" disabled>Add role...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
