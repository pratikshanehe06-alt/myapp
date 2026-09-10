import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PlantDashboard from "./pages/PlantDashboard";
import AssetDetail from "./pages/AssetDetail";
import EmployeesPage from "./pages/EmployeesPage";
import PlantsPage from "./pages/PlantsPage";
import ComingSoon from "./pages/ComingSoon";
import AdminLayout from "./pages/admin/AdminLayout";
import UsersPage from "./pages/admin/UsersPage";
import RolesPage from "./pages/admin/RolesPage";
import TenantsPage from "./pages/admin/TenantsPage";
import AppShell from "./components/AppShell";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<PlantDashboard />} />
          <Route path="assets/:id" element={<AssetDetail />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="plants" element={<PlantsPage />} />
          <Route path="coming-soon/:moduleKey" element={<ComingSoon />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
