import apiClient from "./client";

export interface PlantSummary {
  total_assets: number;
  running: number;
  idle: number;
  fault: number;
  stopped: number;
  maintenance: number;
  offline: number;
  average_health: number;
  critical_assets: number;
}

export interface AssetHealth {
  asset_id: number;
  asset_name: string;
  status: string;
  health_score: number;
  criticality: string;
}

export const getPlantSummary = () =>
  apiClient.get<PlantSummary>("/apm/dashboard/summary").then((r) => r.data);

export const getAssetsHealth = () =>
  apiClient.get<AssetHealth[]>("/apm/assets/health").then((r) => r.data);
