import apiClient from "./client";

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  enabled_modules: string[];
}

export const getCurrentTenant = () =>
  apiClient.get<Tenant>("/tenants/current").then((r) => r.data);

export const getTenants = () =>
  apiClient.get<Tenant[]>("/tenants").then((r) => r.data);

export const createTenant = (data: {
  name: string;
  slug: string;
  enabled_modules: string[];
  admin_email: string;
  admin_password: string;
  admin_full_name?: string;
}) => apiClient.post<Tenant>("/tenants", data).then((r) => r.data);

export const updateTenant = (
  tenantId: number,
  data: { name?: string; is_active?: boolean; enabled_modules?: string[] }
) => apiClient.put<Tenant>(`/tenants/${tenantId}`, data).then((r) => r.data);

export const deleteTenant = (tenantId: number) =>
  apiClient.delete(`/tenants/${tenantId}`).then((r) => r.data);
