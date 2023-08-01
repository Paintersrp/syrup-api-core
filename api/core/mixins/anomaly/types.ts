export interface Anomaly {
  time: number;
  value: number;
}

export type AnomalyMap = Map<string, Anomaly[]>;
export type AnomalyRecords = Record<string, Anomaly[]>;
export type AnomalySesonalityMap = Map<string, number[]>;

export type AnomalyDetectorParams = {
  alpha: number;
  beta: number;
  gamma: number;
};
export type AnomalyParamsMap = Map<string, AnomalyDetectorParams>;

export type AnomalyStatistics = {
  mean: number;
  stdDev: number;
  zScore: number;
  isAnomaly: boolean;
};

export type AnomalyStatisticsModified = {
  median: number;
  mad: number;
  zScore: number;
  isAnomaly: boolean;
};
