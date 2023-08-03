import { LogObject } from '../../../middleware/loggingMiddleware';

export type RequestLogObject = LogObject;

export interface RequestLogReport {
  totalRequests: number;
  averageRequestDuration: number;
  numberOfUsers: number;
  topEndpoints: string[];
  topUsers: string[];
  errorCount: number;
  requestFrequency: Record<string, number>;
  statusCodes: Record<number, number>;
  topStatusCodes: number[];
  longestDuration: number;
  shortestDuration: number;
  requestsByMethod: Record<string, number>;
  topUserAgents: string[];
  averageResponseSize: number;
  uniqueIPs: number;
}

export interface RequestLogMetrics {
  totalRequests: number;
  totalDuration: number;
  totalResponseSize: number;
  errorCount: number;
  shortestDuration: number;
  longestDuration: number;
  userIds: string[];
  paths: string[];
  statusCodes: number[];
  methods: string[];
  userAgents: string[];
  ipAddresses: string[];
  requestFrequency: Record<string, number>;
}
