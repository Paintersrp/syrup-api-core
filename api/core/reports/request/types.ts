import { RequestLogObject } from '../../logging/objects/RequestLogObject';

export type ExtendedRequestLogObject = RequestLogObject & {
  time: string;
};

export type EndpointPerformanceDTO = Record<
  string,
  {
    totalDuration: number;
    totalResponseSize: number;
    count: number;
  }
>;

export type ResponseTimeBucketsDTO = {
  '<100ms': number;
  '100-500ms': number;
  '500-1000ms': number;
  '>1000ms': number;
};

export interface RequestLogReport {
  totalRequests: number;
  averageRequestDuration: number;
  numberOfUsers: number;
  endpointsCount: Record<string, number>;
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
  topIPAddresses: [string, number][];
  requestByHour: Record<string, number>;
  endpointPerformance: EndpointPerformanceDTO;
  responseTimeBuckets: Record<string, number>;
}

export interface RequestLogMetrics {
  totalRequests: number;
  totalDuration: number;
  totalResponseSize: number;
  errorCount: number;
  shortestDuration: number;
  longestDuration: number;
  ipAddresses: Map<string, number>;
  requestFrequency: Record<string, number>;
  userIdsCount: Record<string, number>;
  pathsCount: Record<string, number>;
  statusCodesCount: Record<number, number>;
  methodsCount: Record<string, number>;
  userAgentsCount: Record<string, number>;
  endpointPerformance: EndpointPerformanceDTO;
  responseTimeBuckets: Record<string, number>;
}
