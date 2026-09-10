import apiClient from "./client";

export interface LatestReading {
  tag_id: number;
  tag_name: string;
  unit: string | null;
  value: number;
  quality: string;
}

export const getLatestReadings = (assetId: number) =>
  apiClient.get<LatestReading[]>(`/telemetry/assets/${assetId}/latest`).then((r) => r.data);
