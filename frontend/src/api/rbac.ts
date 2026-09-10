import apiClient from "./client";

export interface Permission {
  id: number;
  code: string;
  description: string | null;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  is_system_role: string;
  permissions: Permission[];
}

export interface UserWithRoles {
  id: number;
  email: string;
  full_name: string | null;
  tenant_id: number | null;
  is_active: boolean;
  roles: { id: number; name: string }[];
}

export const getPermissions = () =>
  apiClient.get<Permission[]>("/rbac/permissions").then((r) => r.data);

export const createPermission = (data: { code: string; description?: string }) =>
  apiClient.post<Permission>("/rbac/permissions", data).then((r) => r.data);

export const getRoles = () =>
  apiClient.get<Role[]>("/rbac/roles").then((r) => r.data);

export const createRole = (data: { name: string; description?: string; permission_ids: number[] }) =>
  apiClient.post<Role>("/rbac/roles", data).then((r) => r.data);

export const updateRole = (
  roleId: number,
  data: { name?: string; description?: string; permission_ids?: number[] }
) => apiClient.put<Role>(`/rbac/roles/${roleId}`, data).then((r) => r.data);

export const deleteRole = (roleId: number) =>
  apiClient.delete(`/rbac/roles/${roleId}`).then((r) => r.data);

export const getUsers = () =>
  apiClient.get<UserWithRoles[]>("/rbac/users").then((r) => r.data);

export const assignRoleToUser = (userId: number, roleId: number) =>
  apiClient.post(`/rbac/users/${userId}/roles/${roleId}`).then((r) => r.data);

export const removeRoleFromUser = (userId: number, roleId: number) =>
  apiClient.delete(`/rbac/users/${userId}/roles/${roleId}`).then((r) => r.data);

export const getMyPermissions = () =>
  apiClient.get<{ permissions: string[] }>("/rbac/my-permissions").then((r) => r.data);
