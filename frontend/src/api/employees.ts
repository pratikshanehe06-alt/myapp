import apiClient from "./client";

export interface Employee {
  id: number;
  employee_code: string | null;
  full_name: string;
  designation: string | null;
  department: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

export const getEmployees = () =>
  apiClient.get<Employee[]>("/employees").then((r) => r.data);

export const createEmployee = (data: {
  full_name: string;
  employee_code?: string;
  designation?: string;
  department?: string;
  contact_email?: string;
  contact_phone?: string;
}) => apiClient.post<Employee>("/employees", data).then((r) => r.data);

export const updateEmployee = (
  employeeId: number,
  data: Partial<{
    full_name: string;
    employee_code: string;
    designation: string;
    department: string;
    contact_email: string;
    contact_phone: string;
  }>
) => apiClient.put<Employee>(`/employees/${employeeId}`, data).then((r) => r.data);

export const deleteEmployee = (employeeId: number) =>
  apiClient.delete(`/employees/${employeeId}`).then((r) => r.data);
