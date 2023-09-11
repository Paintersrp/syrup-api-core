import { ScheduleConfig } from './Job';

import { JobMiddlewareType } from './services/JobMiddleware/types';
import { RetryStrategy } from './services/JobRetryService/types';

export type JobTask = () => Promise<void>;

export interface JobHooks {
  onInitialize?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  [key: string]: any;
}

export interface JobOptions {
  name: string;
  task: JobTask;
  schedule: ScheduleConfig;
  hooks?: Partial<JobHooks>;
  priority?: number;
  maxRetries?: number;
  retryDelay?: number;
  retryStrategy?: RetryStrategy;
  middleware?: JobMiddlewareType[];
}

export type JobStatus = 'idle' | 'running' | 'completed' | 'paused' | 'error';
