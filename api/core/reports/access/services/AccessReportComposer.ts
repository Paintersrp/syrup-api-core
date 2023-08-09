import { AccessReportGenerator } from '../AccessReportGenerator';
import { AccessLogMetrics, AccessLogReport } from '../types';

export class AccessReportComposer {
  protected generator: AccessReportGenerator;

  /**
   * @param {string} generator
   * @constructor
   */
  constructor(generator: AccessReportGenerator) {
    this.generator = generator;
  }
  /**
   * Creates a report based on the given metrics.
   * The report includes total requests, denied and allowed requests, number of unique IPs and users,
   * role, action, and resource access stats, and top users, roles, actions, resources, and rules.
   * @param metrics The collected metrics.
   * @returns The generated report.
   */
  public createReport(metrics: AccessLogMetrics): AccessLogReport {
    const report: Partial<AccessLogReport> = {};

    report.totalRequests = metrics.totalRequests;
    report.totalDenied = metrics.totalDenied;
    report.totalAllowed = metrics.totalAllowed;
    report.uniqueIPs = metrics.ipAddresses.size;
    report.numberOfUsers = metrics.users.size;
    report.roleAccessStats = metrics.roleAccessStats;
    report.actionAccessStats = metrics.actionAccessStats;
    report.resourceAccessStats = metrics.resourceAccessStats;

    this.addAccessFrequencyReport(metrics, report);
    this.addDeniedAccessPatternReport(metrics, report);

    return report as AccessLogReport;
  }

  /**
   * Adds access frequency related stats to the report.
   * @param metrics The collected metrics.
   * @param report The report to add the stats to.
   */
  private addAccessFrequencyReport(
    metrics: AccessLogMetrics,
    report: Partial<AccessLogReport>
  ): void {
    const accessFrequencyCount = this.generator.countItems(Object.values(metrics.accessFrequency));
    report.topUsers = this.getTopItemsWithKey(accessFrequencyCount, 'user');
    report.topRoles = this.getTopItemsWithKey(accessFrequencyCount, 'role');
    report.topActions = this.getTopItemsWithKey(accessFrequencyCount, 'action');
    report.topResources = this.getTopItemsWithKey(accessFrequencyCount, 'resource');
    report.topRules = this.getTopItemsWithKey(accessFrequencyCount, 'rule');
  }

  /**
   * Adds denied access pattern related stats to the report.
   * @param metrics The collected metrics.
   * @param report The report to add the stats to.
   */
  private addDeniedAccessPatternReport(
    metrics: AccessLogMetrics,
    report: Partial<AccessLogReport>
  ): void {
    const deniedAccessPatternsCount = this.generator.countItems(
      Object.values(metrics.deniedAccessPatterns)
    );
    report.topDeniedAccessPatterns = this.generator.getTop(deniedAccessPatternsCount);
  }

  /**
   * Gets the top items from the counts. The items are sorted by count in descending order.
   * @param counts The item counts.
   * @param keyPart Optional. The part of the item key to filter by.
   * @param limit Optional. The number of top items to return. Default is 5.
   * @returns The top items.
   */
  protected getTopItemsWithKey(
    counts: Record<string, number>,
    keyPart?: string,
    limit: number = 5
  ): string[] {
    let items = Object.entries(counts);

    if (keyPart) {
      items = items.filter(([key, _]) => key.includes(keyPart));
    }

    return items
      .sort((a, b) => b[1] - a[1])
      .map(([key, _]) => key)
      .slice(0, limit);
  }
}
