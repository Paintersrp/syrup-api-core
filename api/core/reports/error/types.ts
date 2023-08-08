import { ErrorSeverity } from './enums';

/**
 * `ErrorLogObject` represents a single error log entry.
 */
export interface ErrorLogObject {
  time: Date;
  path: string;
  method: string;
  userAgent: string;
  ipAddress: string;
  status: number;
  errorLevel: ErrorSeverity;
  errorMessage: string;
  errorStack?: string;
}

/**
 * `ErrorLogMetrics` represents various metrics collected from the error logs.
 */
export interface ErrorLogMetrics {
  totalErrors: number;
  errorCodes: { [key: number]: number };
  paths: { [key: string]: number };
  methods: { [key: string]: number };
  userAgents: { [key: string]: number };
  ipAddresses: { [key: string]: number };
  errorCountByHour: { [hour: string]: number };
  errorCountByDay: { [day: string]: number };
  classifications: { [key: string]: number };
  severityCounts: { [key in ErrorSeverity]?: number };
}

/**
 * `ErrorLogReport` represents a report created from the error logs.
 */
export interface ErrorLogReport {
  totalErrors: number;
  uniqueIPs: number;
  errorCodes: { [key: number]: number };
  topErrorEndpoints: { [key: string]: number };
  errorsByMethod: { [key: string]: number };
  topErrorUserAgents: { [key: string]: number };
  peakErrorHour: string;
  errorCountByHour: { [hour: string]: number };
  errorCountByDay: { [day: string]: number };
  classifications: { [key: string]: number };
  severityCounts: { [key in ErrorSeverity]?: number };
  // [key: string]: any;
}
