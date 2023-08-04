import { AuditAction, AuditLog } from '../../model/auditlog';
import { AuditLogMetrics } from './types';

export class AuditReportGenerator {
  private logs: AuditLog<any, any>[];

  constructor(logs: AuditLog<any, any>[]) {
    this.logs = logs;
  }

  public analyzeLogs(): AuditLogMetrics {
    const metrics = this.collectMetrics();

    Object.entries(metrics.fieldChangeCounts).forEach(([model, fieldCounts]) => {
      const sortedFields = Object.entries(fieldCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([field, _]) => field);
      metrics.topChangedFields[model] = sortedFields.slice(0, 5);
    });

    return metrics;
  }

  private collectMetrics(): AuditLogMetrics {
    const metrics: AuditLogMetrics = {
      totalLogs: 0,
      createActions: 0,
      updateActions: 0,
      deleteActions: 0,
      users: [],
      models: [],
      userActionFrequency: {},
      modelActionFrequency: {},
      userChangeCounts: {},
      userModelCounts: {},
      modelActionCounts: {},
      fieldChangeCounts: {},
      topChangedFields: {},
    };

    this.logs.forEach((log) => this.addLogToMetrics(log, metrics));

    return metrics;
  }

  private addLogToMetrics(log: AuditLog<any, any>, metrics: AuditLogMetrics): void {
    metrics.totalLogs++;
    this.incrementActionCount(log, metrics);
    this.addToListIfUnique(metrics.users, log.username);
    this.addToListIfUnique(metrics.models, log.model);

    const userKey = `${log.username}-${log.action}`;
    metrics.userActionFrequency[userKey] = (metrics.userActionFrequency[userKey] || 0) + 1;

    const modelKey = `${log.model}-${log.action}`;
    metrics.modelActionFrequency[modelKey] = (metrics.modelActionFrequency[modelKey] || 0) + 1;

    metrics.userChangeCounts[log.username] = (metrics.userChangeCounts[log.username] || 0) + 1;

    metrics.userModelCounts[log.username] = metrics.userModelCounts[log.username] || {};
    metrics.userModelCounts[log.username][log.model] =
      (metrics.userModelCounts[log.username][log.model] || 0) + 1;

    metrics.modelActionCounts[log.model] = metrics.modelActionCounts[log.model] || {};
    metrics.modelActionCounts[log.model][log.action] =
      (metrics.modelActionCounts[log.model][log.action] || 0) + 1;

    if (log.model !== 'User') {
      if (log.action === AuditAction.UPDATE) {
        const changedFields = this.getChangedFields(log);
        changedFields.forEach((field) => {
          metrics.fieldChangeCounts[log.model] = metrics.fieldChangeCounts[log.model] || {};
          metrics.fieldChangeCounts[log.model][field] =
            (metrics.fieldChangeCounts[log.model][field] || 0) + 1;
        });
      }
    }
  }

  private getChangedFields(log: AuditLog<any, any>): string[] {
    const beforeData = (log.beforeData as unknown as Record<string, unknown>) || {};
    const afterData = (log.afterData as unknown as Record<string, unknown>) || {};
    const allFields = new Set([...Object.keys(beforeData), ...Object.keys(afterData)]);
    console.log(allFields);
    const changedFields: string[] = [];

    allFields.forEach((field) => {
      console.log(field);
      if (beforeData[field] !== afterData[field]) {
        changedFields.push(field);
      }
    });

    return changedFields;
  }

  private incrementActionCount(log: AuditLog<any, any>, metrics: AuditLogMetrics): void {
    if (log.action === AuditAction.CREATE) {
      metrics.createActions++;
    } else if (log.action === AuditAction.UPDATE) {
      metrics.updateActions++;
    } else if (log.action === AuditAction.DELETE) {
      metrics.deleteActions++;
    }
  }

  private addToListIfUnique(list: string[], item: string): void {
    if (!list.includes(item)) {
      list.push(item);
    }
  }
}
