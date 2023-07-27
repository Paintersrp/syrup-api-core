export const SystemRespones = {
  UP: 'System is up',
  DOWN: 'System is down',
  HEALTHY: 'System is healthy',
  UNHEALTHY: 'System is unhealthy',
  CHECK_FAILED: (check: string) => `Health check failed: ${check}`,
  DB_SUCCESS: 'Connected to the database successfully',
  DB_FAIL: 'Failed to connect to the database',
  DB_DISCONNECT_SUCCESS: 'Disconnected from the database successfully',
  DB_DISCONNECT_FAIL: 'Failed to disconnect from the database',
  ANOMALY_FOUND: 'Anomaly detected',
  NO_ANOMALIES: 'No anomalies detected',
};
