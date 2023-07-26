export interface Anomaly {
  time: number;
  value: number;
}

export type AnomalyMap = Map<string, Anomaly[]>;
export type AnomalyRecords = Record<string, Anomaly[]>;

export type AnomalyDetectorParams = Map<
  string,
  { alpha: number; beta: number; gamma: number; threshold: number }
>;
