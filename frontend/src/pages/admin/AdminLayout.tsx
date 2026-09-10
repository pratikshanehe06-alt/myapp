import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "sans-serif", display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: "220px", background: "#1a1a2e", color: "white", padding: "1.5rem 1rem" }}>
        <h3 style={{ marginBottom: "2rem" }}>CoreOT Admin</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link to="/admin/tenants" style={{ color: "white", textDecoration: "none" }}>
            Tenants
          </Link>
          <Link to="/admin/users" style={{ color: "white", textDecoration: "none" }}>
            Users
          </Link>
          <Link to="/admin/roles" style={{ color: "white", textDecoration: "none" }}>
            Roles & Permissions
          </Link>
          <Link to="/dashboard" style={{ color: "white", textDecoration: "none", marginTop: "1rem" }}>
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleLogout}
            style={{ marginTop: "1rem", background: "none", border: "1px solid white", color: "white", padding: "0.4rem", borderRadius: "4px", cursor: "pointer" }}
          >
            Log out
          </button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
