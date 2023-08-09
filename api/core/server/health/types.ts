export type HealthCheck = () => Promise<boolean>;
export interface NamedHealthCheck {
  name: string;
  check: HealthCheck;
}

export type RemediationFunction = () => Promise<void>;
export interface HealthCheckWithRemediation {
  check: HealthCheck;
  remediate?: RemediationFunction;
}

export type HealthChecks = Map<string, HealthCheckWithRemediation>;
