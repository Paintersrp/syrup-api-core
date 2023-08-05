import { RBACLogObject, AccessLogMetrics, AccessLogReport, AccessStats } from './types';
import { BaseReportGenerator } from '../BaseReportGenerator';

/**
 * The AccessReportGenerator class provides methods for analyzing access logs and generating reports.
 * It extends the BaseReportGenerator class, adding functionality specific to access logs.
 */
export class AccessReportGenerator extends BaseReportGenerator<RBACLogObject> {
  /**
   * Analyzes the loaded logs and generates a report.
   * @returns A promise that resolves with the generated report.
   */
  public async analyzeLogs(): Promise<Partial<AccessLogReport>> {
    await this.loadLogs();
    const metrics = this.collectMetrics();
    return this.createReport(metrics);
  }

  private collectMetrics(): AccessLogMetrics {
    const metrics: AccessLogMetrics = {
      totalRequests: 0,
      totalDenied: 0,
      totalAllowed: 0,
      users: [],
      roles: [],
      accessDecisions: [],
      actions: [],
      resources: [],
      rules: [],
      userAgents: [],
      ipAddresses: [],
      accessFrequency: {},
      deniedAccessPatterns: {},
      roleAccessStats: {},
      actionAccessStats: {},
      resourceAccessStats: {},
    };

    this.logs.forEach((log) => this.addLogToMetrics(log, metrics));

    return metrics;
  }

  private addLogToMetrics(log: RBACLogObject, metrics: AccessLogMetrics): void {
    const accessType = log.access === 'ALLOW' ? 'allowed' : 'denied';
    metrics.totalRequests++;

    if (accessType === 'denied') {
      metrics.totalDenied++;
      this.updateDeniedAccessPatterns(log, metrics);
    } else {
      metrics.totalAllowed++;
    }

    this.updateStats(metrics.roleAccessStats, log.role, accessType);
    this.updateStats(metrics.actionAccessStats, log.action, accessType);
    this.updateStats(metrics.resourceAccessStats, log.resource, accessType);

    this.addToListIfUnique(metrics.users, log.user);
    this.addToListIfUnique(metrics.roles, log.role);
    this.addToListIfUnique(metrics.accessDecisions, log.access);
    this.addToListIfUnique(metrics.actions, log.action);
    this.addToListIfUnique(metrics.resources, log.resource);
    this.addToListIfUnique(metrics.rules, log.rule);
    this.addToListIfUnique(metrics.userAgents, log.userAgent);
    this.addToListIfUnique(metrics.ipAddresses, log.ipAddress);

    const accessKey = this.generateAccessKey(log);
    metrics.accessFrequency[accessKey] = (metrics.accessFrequency[accessKey] || 0) + 1;
  }

  private updateDeniedAccessPatterns(log: RBACLogObject, metrics: AccessLogMetrics): void {
    const patternKey = `${log.user}-${log.role}-${log.action}-${log.resource}`;
    metrics.deniedAccessPatterns[patternKey] = (metrics.deniedAccessPatterns[patternKey] || 0) + 1;
  }

  private updateStats(
    stats: Record<string, AccessStats>,
    key: string,
    accessType: 'allowed' | 'denied'
  ): void {
    stats[key] = stats[key] || {
      total: 0,
      denied: 0,
      allowed: 0,
    };
    stats[key].total++;
    stats[key][accessType]++;
  }

  private generateAccessKey(log: RBACLogObject): string {
    return `${log.user}-${log.role}-${log.action}-${log.resource}-${log.access}`;
  }

  private createReport(metrics: AccessLogMetrics): AccessLogReport {
    const report: Partial<AccessLogReport> = {};

    report.totalRequests = metrics.totalRequests;
    report.totalDenied = metrics.totalDenied;
    report.totalAllowed = metrics.totalAllowed;
    report.uniqueIPs = metrics.ipAddresses.length;
    report.numberOfUsers = metrics.users.length;
    report.roleAccessStats = metrics.roleAccessStats;
    report.actionAccessStats = metrics.actionAccessStats;
    report.resourceAccessStats = metrics.resourceAccessStats;

    this.addAccessFrequencyReport(metrics, report);
    this.addDeniedAccessPatternReport(metrics, report);

    return report as AccessLogReport;
  }

  private addAccessFrequencyReport(
    metrics: AccessLogMetrics,
    report: Partial<AccessLogReport>
  ): void {
    const accessFrequencyCount = this.countItems(Object.values(metrics.accessFrequency));
    report.topUsers = this.getTopItemsWithKey(accessFrequencyCount, 'user');
    report.topRoles = this.getTopItemsWithKey(accessFrequencyCount, 'role');
    report.topActions = this.getTopItemsWithKey(accessFrequencyCount, 'action');
    report.topResources = this.getTopItemsWithKey(accessFrequencyCount, 'resource');
    report.topRules = this.getTopItemsWithKey(accessFrequencyCount, 'rule');
  }

  private addDeniedAccessPatternReport(
    metrics: AccessLogMetrics,
    report: Partial<AccessLogReport>
  ): void {
    const deniedAccessPatternsCount = this.countItems(Object.values(metrics.deniedAccessPatterns));
    report.topDeniedAccessPatterns = this.getTop(deniedAccessPatternsCount);
  }

  protected getTopItemsWithKey(
    counts: Record<string, number>,
    keyPart?: string,
    limit: number = 5
  ): string[] {
    let sortedItems = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, _]) => key);

    if (keyPart) {
      sortedItems = sortedItems.filter((key) => key.includes(keyPart));
    }

    return sortedItems.slice(0, limit);
  }
}
