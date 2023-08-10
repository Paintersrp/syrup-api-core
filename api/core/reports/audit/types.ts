import { AuditAction } from '../../models/logging/Audit';

export type ModelRecord = Record<string, unknown>;
export type MetricKey = string | AuditAction;
export type ActionCounts = Map<MetricKey, number>;
export type NestedActionCounts = Map<MetricKey, ActionCounts>;

export interface AuditLogMetrics {
  totalLogs: number;
  actionCounts: ActionCounts;
  users: Set<string>;
  models: Set<string>;
  userActionFrequency: ActionCounts;
  modelActionFrequency: ActionCounts;
  userChangeCounts: ActionCounts;
  userModelCounts: NestedActionCounts;
  modelActionCounts: NestedActionCounts;
  fieldChangeCounts: NestedActionCounts;
  topChangedFields: Map<string, string[]>;
}
