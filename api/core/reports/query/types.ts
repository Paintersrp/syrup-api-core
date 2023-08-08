import { QueryLogObjectContext } from '../../database/services/queries/types';

export interface QueryReportLogObject {
  level: number;
  time: string;
  pid: number;
  hostname: string;
  name: string;
  message: string;
  context: QueryLogObjectContext;
}

export interface QueryLogReport {
  totalQueries: number;
  averageQueryDuration: number;
  longestDuration: number;
  shortestDuration: number;
  queriesByType: Map<string, AggregatedQueryMetrics>;
  queriesByModel: Map<string, AggregatedQueryMetrics>;
  queryFrequency: QueryFrequencies;
  durationBuckets: Record<string, number>;
  topModels: { type: string; totalDuration: number }[];
  slowestQueries: { id: string; ms: number }[];
}

export type AggregatedQuery = Map<string, AggregatedQueryMetrics>;
export type AggregatedMetrics = 'type' | 'modelName';

export interface QueryFrequency {
  [key: number]: number;
}

export interface QueryFrequencies {
  hourly: QueryFrequency;
  daily: QueryFrequency;
  weekly: QueryFrequency;
  monthly: QueryFrequency;
}

export interface AggregatedQueryMetrics {
  totalQueries: number;
  totalDuration: number;
  avgDuration: number;
  maxDuration: number;
  minDuration: number;
}

export type FrequencyOptions = 'hourly' | 'daily' | 'weekly' | 'monthly';
