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
  queriesByType: Record<string, AggregatedQueryMetrics>;
  queriesByModel: Record<string, AggregatedQueryMetrics>;
  queryFrequency: QueryFrequencies;
  durationBuckets: Record<string, number>;
  top10QueryTypes: string[];
  top10SlowestQueries: string[];
}

export type AggregatedQuery = Record<string, AggregatedQueryMetrics>;
export type AggregatedMetrics = 'type' | 'modelName';

export type QueryFrequency = Record<string, number>;

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
