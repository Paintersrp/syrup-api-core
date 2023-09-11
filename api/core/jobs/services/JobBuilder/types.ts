import { Job, ScheduleConfig } from '../../Job';
import { JobHooks, JobOptions, JobTask } from '../../types';
import { JobMiddlewareType } from '../JobMiddleware/types';
import { RetryStrategy } from '../JobRetryService/types';

export type JobBuilderOptions = {
  [P in keyof JobOptions]?: JobOptions[P];
};

export interface IWithName {
  withName(name: string): IWithTask;
}

export interface IWithTask {
  withTask(task: JobTask): IWithSchedule;
}

export interface IWithSchedule {
  withSchedule(schedule: ScheduleConfig): IBuildable;
}

export interface IBuildable {
  withHook(hook: keyof JobHooks, callback: () => Promise<void>): IBuildable;
  withPriority(priority: number): IBuildable;
  withMaxRetries(maxRetries: number): IBuildable;
  withRetryDelay(delay: number): IBuildable;
  useMiddleware(middleware: JobMiddlewareType): IBuildable;
  useRetryStrategy(strategy: RetryStrategy): IBuildable;
  build(): Job;
}
