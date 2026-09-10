import { useEffect, useState } from "react";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../api/employees";
import type { Employee } from "../api/employees";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesignation, setEditDesignation] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const load = () => {
    getEmployees()
      .then(setEmployees)
      .catch((err) => setError(err.response?.data?.detail || "Failed to load employees."));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    await createEmployee({ full_name: fullName, designation, department });
    setFullName("");
    setDesignation("");
    setDepartment("");
    load();
  };

  const startEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEditDesignation(emp.designation || "");
    setEditDepartment(emp.department || "");
  };

  const saveEdit = async (id: number) => {
    await updateEmployee(id, { designation: editDesignation, department: editDepartment });
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    load();
  };

  return (
    <div>
      <h2>Employees</h2>
      {error && <p style={{ color: "var(--state-fault)" }}>{error}</p>}

      <div className="panel">
        <div className="panel-title">Add Employee</div>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input className="input-field" style={{ width: "200px" }} placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className="input-field" style={{ width: "180px" }} placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
          <input className="input-field" style={{ width: "180px" }} placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </div>

      <table className="asset-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.full_name}</td>
              <td>
                {editingId === e.id ? (
                  <input className="input-field" value={editDesignation} onChange={(ev) => setEditDesignation(ev.target.value)} />
                ) : (
                  e.designation || "—"
                )}
              </td>
              <td>
                {editingId === e.id ? (
                  <input className="input-field" value={editDepartment} onChange={(ev) => setEditDepartment(ev.target.value)} />
                ) : (
                  e.department || "—"
                )}
              </td>
              <td>
                {editingId === e.id ? (
                  <button className="btn-primary" onClick={() => saveEdit(e.id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => startEdit(e)} style={{ marginRight: "0.5rem", border: "none", background: "none", color: "var(--coreot-accent)", cursor: "pointer" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(e.id)} style={{ border: "none", background: "none", color: "var(--state-fault)", cursor: "pointer" }}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
