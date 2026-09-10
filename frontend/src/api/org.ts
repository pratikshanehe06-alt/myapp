import apiClient from "./client";

export interface Site {
  id: number;
  name: string;
  code: string | null;
  location: string | null;
}

export interface Area {
  id: number;
  site_id: number;
  name: string;
  code: string | null;
}

export const getSites = () => apiClient.get<Site[]>("/org/sites").then((r) => r.data);

export const createSite = (data: { name: string; code?: string; location?: string }) =>
  apiClient.post<Site>("/org/sites", data).then((r) => r.data);

export const updateSite = (siteId: number, data: { name?: string; code?: string; location?: string }) =>
  apiClient.put<Site>(`/org/sites/${siteId}`, data).then((r) => r.data);

export const deleteSite = (siteId: number) =>
  apiClient.delete(`/org/sites/${siteId}`).then((r) => r.data);

export const getAreas = (siteId: number) =>
  apiClient.get<Area[]>(`/org/sites/${siteId}/areas`).then((r) => r.data);

export const createArea = (data: { site_id: number; name: string; code?: string }) =>
  apiClient.post<Area>("/org/areas", data).then((r) => r.data);

export const updateArea = (areaId: number, data: { name?: string; code?: string }) =>
  apiClient.put<Area>(`/org/areas/${areaId}`, data).then((r) => r.data);

export const deleteArea = (areaId: number) =>
  apiClient.delete(`/org/areas/${areaId}`).then((r) => r.data);
