export interface AuditLogMetrics {
  totalLogs: number;
  createActions: number;
  updateActions: number;
  deleteActions: number;
  users: string[];
  models: string[];
  userActionFrequency: Record<string, number>;
  modelActionFrequency: Record<string, number>;
  userChangeCounts: Record<string, number>;
  userModelCounts: Record<string, Record<string, number>>;
  modelActionCounts: Record<string, Record<string, number>>;
  fieldChangeCounts: Record<string, Record<string, number>>;
  topChangedFields: Record<string, string[]>;
}
