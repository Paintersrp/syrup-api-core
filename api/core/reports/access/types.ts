export type LogKey = 'role' | 'action' | 'resource';

export interface RBACLogObject {
  timestamp: string;
  user: string;
  role: string;
  access: 'ALLOW' | 'DENY';
  action: string;
  resource: string;
  rule: string;
  userAgent: string;
  ipAddress: string;
}

export interface AccessLogMetrics {
  totalRequests: number;
  totalDenied: number;
  totalAllowed: number;
  users: Set<string>;
  roles: Set<string>;
  accessDecisions: Set<string>;
  actions: Set<string>;
  resources: Set<string>;
  rules: Set<string>;
  userAgents: Set<string>;
  ipAddresses: Set<string>;
  accessFrequency: Record<string, number>;
  deniedAccessPatterns: Record<string, number>;
  roleAccessStats: Record<string, AccessStats>;
  actionAccessStats: Record<string, AccessStats>;
  resourceAccessStats: Record<string, AccessStats>;
}

export interface AccessLogReport {
  totalRequests: number;
  totalDenied: number;
  totalAllowed: number;
  uniqueIPs: number;
  numberOfUsers: number;
  topUsers: string[];
  topRoles: string[];
  accessDecisions: Record<string, number>;
  topActions: string[];
  topResources: string[];
  topRules: string[];
  topDeniedAccessPatterns: string[];
  roleAccessStats: Record<string, AccessStats>;
  actionAccessStats: Record<string, AccessStats>;
  resourceAccessStats: Record<string, AccessStats>;
}

export interface AccessStats {
  total: number;
  allowed: number;
  denied: number;
}

export interface DeniedAccessPatternStats {
  total: number;
}
