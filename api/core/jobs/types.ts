export type JobTask = () => Promise<void>;

export interface JobHooks {
  onInitialize?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface JobOptions {
  name: string;
  task: JobTask;
  schedule: string;
  hooks?: Partial<JobHooks>;
  priority?: number;
  maxRetries?: number;
}

export type JobStatus = 'idle' | 'running' | 'completed' | 'paused' | 'error';
