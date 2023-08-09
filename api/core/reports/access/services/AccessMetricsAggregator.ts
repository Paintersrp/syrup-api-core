import { RBACLogObject, AccessLogMetrics, AccessStats, LogKey } from '../types';

/**
 * The AccessReportGenerator class provides methods for analyzing access logs and generating reports.
 * It extends the BaseReportGenerator class, adding functionality specific to access logs.
 */
export class AccessMetricsAggregator {
  private keyToStatsMapping: Record<LogKey, keyof AccessLogMetrics> = {
    role: 'roleAccessStats',
    action: 'actionAccessStats',
    resource: 'resourceAccessStats',
  };

  /**
   * Goes through all the logs and collects relevant metrics.
   * Metrics include counts of different log properties, and lists of unique users, roles,
   * decisions, actions, resources, rules, user agents, and IP addresses.
   * @returns The collected metrics.
   */
  public collectMetrics(logs: RBACLogObject[]): AccessLogMetrics {
    return logs.reduce((metrics, log) => {
      const accessType = log.access === 'ALLOW' ? 'allowed' : 'denied';
      metrics.totalRequests++;

      const patternKey = `${log.user}-${log.role}-${log.action}-${log.resource}`;
      const accessKey = `${patternKey}-${log.access}`;

      if (accessType === 'denied') {
        metrics.totalDenied++;
        metrics.deniedAccessPatterns[patternKey] =
          (metrics.deniedAccessPatterns[patternKey] || 0) + 1;
      } else {
        metrics.totalAllowed++;
      }

      (['role', 'action', 'resource'] as const).forEach((key: LogKey) => {
        const statsKey = this.keyToStatsMapping[key];
        const stats = metrics[statsKey] as Record<string, AccessStats>;
        const logKey = log[key];

        if (!stats[logKey]) {
          stats[logKey] = { total: 0, denied: 0, allowed: 0 };
        }

        stats[logKey].total++;
        stats[logKey][accessType]++;
      });

      metrics.users.add(log.user);
      metrics.roles.add(log.role);
      metrics.accessDecisions.add(log.access);
      metrics.actions.add(log.action);
      metrics.resources.add(log.resource);
      metrics.rules.add(log.rule);
      metrics.userAgents.add(log.userAgent);
      metrics.ipAddresses.add(log.ipAddress);

      metrics.accessFrequency[accessKey] = (metrics.accessFrequency[accessKey] || 0) + 1;

      return metrics;
    }, this.initialMetrics());
  }

  /**
   * Provides the initial state of the metrics.
   * @returns The initial metrics.
   */
  private initialMetrics(): AccessLogMetrics {
    return {
      totalRequests: 0,
      totalDenied: 0,
      totalAllowed: 0,
      users: new Set(),
      roles: new Set(),
      accessDecisions: new Set(),
      actions: new Set(),
      resources: new Set(),
      rules: new Set(),
      userAgents: new Set(),
      ipAddresses: new Set(),
      accessFrequency: {},
      deniedAccessPatterns: {},
      roleAccessStats: {},
      actionAccessStats: {},
      resourceAccessStats: {},
    };
  }
}
