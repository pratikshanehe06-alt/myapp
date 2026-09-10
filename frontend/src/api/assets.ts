import apiClient from "./client";

export interface Asset {
  id: number;
  area_id: number;
  asset_code: string;
  name: string;
  asset_type: string;
  manufacturer: string | null;
  model: string | null;
  criticality: string;
  status: string;
}

export const getAssets = () =>
  apiClient.get<Asset[]>("/assets").then((r) => r.data);

export const getAsset = (id: number) =>
  apiClient.get<Asset>(`/assets/${id}`).then((r) => r.data);
