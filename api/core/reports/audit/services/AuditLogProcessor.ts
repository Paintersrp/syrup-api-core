import { AuditAction, Audit } from '../../../models/logging/Audit';
import {
  ActionCounts,
  AuditLogMetrics,
  MetricKey,
  ModelRecord,
  NestedActionCounts,
} from '../types';

export class AuditLogProcessor {
  /**
   * Initializes the metrics object.
   * @returns An initialized metrics object.
   */
  public initializeMetrics(): AuditLogMetrics {
    return {
      totalLogs: 0,
      actionCounts: new Map(),
      users: new Set(),
      models: new Set(),
      userActionFrequency: new Map(),
      modelActionFrequency: new Map(),
      userChangeCounts: new Map(),
      userModelCounts: new Map(),
      modelActionCounts: new Map(),
      fieldChangeCounts: new Map(),
      topChangedFields: new Map(),
    };
  }

  /**
   * Processes a batch of logs.
   */
  public processBatch(batch: Audit[], metrics: AuditLogMetrics): void {
    batch.forEach((log) => this.addLogToMetrics(log, metrics));
  }

  /**
   * Processes a single audit log and updates the metrics based on it.
   * @param log The audit log to process.
   * @param metrics The metrics to update.
   */
  private addLogToMetrics(log: Audit, metrics: AuditLogMetrics): void {
    console.log(metrics);
    metrics.totalLogs++;
    this.incrementCounter(log.action, metrics.actionCounts);
    metrics.users.add(log.username);
    metrics.models.add(log.model);

    this.incrementFrequency(`${log.username}-${log.action}`, metrics.userActionFrequency);
    this.incrementFrequency(`${log.model}-${log.action}`, metrics.modelActionFrequency);

    this.incrementCounter(log.username, metrics.userChangeCounts);

    this.incrementNestedCounter(log.username, log.model, metrics.userModelCounts);
    this.incrementNestedCounter(log.model, log.action, metrics.modelActionCounts);

    if (log.model !== 'User' && log.action === AuditAction.UPDATE) {
      const changedFields = this.getChangedFields(log);
      changedFields.forEach((field) => {
        this.incrementNestedCounter(log.model, field, metrics.fieldChangeCounts);
        this.maintainTopFields(log.model, field, metrics);
      });
    }
  }

  /**
   * Increments the count associated with a key in a map.
   * @param key The key to increment.
   * @param map The map to increment the key in.
   */
  private incrementCounter(key: MetricKey, map: Map<MetricKey, number>): void {
    map.set(key, (map.get(key) || 0) + 1);
  }

  /**
   * Increments the frequency associated with a key in an action counts map.
   * @param key The key to increment.
   * @param map The action counts map to increment the key in.
   */
  private incrementFrequency(key: MetricKey, map: ActionCounts): void {
    map.set(key, (map.get(key) || 0) + 1);
  }

  /**
   * Increments the count associated with a pair of keys in a nested action counts map.
   * @param key1 The first key.
   * @param key2 The second key.
   * @param map The nested action counts map to increment the keys in.
   */
  private incrementNestedCounter(key1: MetricKey, key2: MetricKey, map: NestedActionCounts): void {
    if (map.has(key1)) {
      const nestedMap = map.get(key1) as ActionCounts;
      nestedMap.set(key2, (nestedMap.get(key2) || 0) + 1);
    } else {
      const nestedMap = new Map();
      nestedMap.set(key2, 1);
      map.set(key1, nestedMap);
    }
  }

  /**
   * Identifies the fields that were changed in an audit log.
   * @param log The audit log to analyze.
   * @returns The fields that were changed.
   */
  private getChangedFields(log: Audit): string[] {
    const beforeData = (log.beforeData as unknown as ModelRecord) || {};
    const afterData = (log.afterData as unknown as ModelRecord) || {};

    const changedFields: string[] = [];

    for (let field in beforeData) {
      if (beforeData[field] !== afterData[field]) {
        changedFields.push(field);
      }
    }

    for (let field in afterData) {
      if (!beforeData.hasOwnProperty(field)) {
        changedFields.push(field);
      }
    }

    return changedFields;
  }

  /**
   * Updates the top changed fields for a model based on a newly changed field.
   * @param model The model that the field belongs to.
   * @param field The field that was changed.
   * @param metrics The metrics to update.
   */
  private maintainTopFields(model: string, field: string, metrics: AuditLogMetrics): void {
    const fieldCounts = metrics.fieldChangeCounts.get(model);
    const topChangedFields = metrics.topChangedFields.get(model) || [];

    if (fieldCounts) {
      const currentFieldCount = fieldCounts.get(field) || 0;
      const topFieldCount = topChangedFields[0] ? fieldCounts.get(topChangedFields[0]) || 0 : 0;

      if (currentFieldCount > topFieldCount) {
        topChangedFields.unshift(field);
      }
    }

    if (topChangedFields.length > 5) {
      topChangedFields.pop();
    }

    metrics.topChangedFields.set(model, topChangedFields);
  }
}
