import { Job, ScheduleConfig } from '../../Job';
import { JobHooks, JobOptions, JobTask } from '../../types';
import { JobMiddlewareType } from '../JobMiddleware/types';
import { RetryStrategy } from '../JobRetryService/types';
import { JobScheduler } from '../JobScheduler/JobScheduler';

import { IBuildable, IWithName, IWithSchedule, IWithTask, JobBuilderOptions } from './types';

export class JobBuilder implements IWithName, IWithTask, IWithSchedule, IBuildable {
  private options: JobBuilderOptions = {};

  useMiddleware(middleware: JobMiddlewareType): IBuildable {
    this.options.middleware = this.options.middleware || [];
    this.options.middleware.push(middleware);
    return this;
  }

  withName(name: string): IWithTask {
    this.options.name = name;
    return this;
  }

  withTask(task: JobTask): IWithSchedule {
    this.options.task = task;
    return this;
  }

  withSchedule(schedule: ScheduleConfig): IBuildable {
    this.options.schedule = schedule;
    return this;
  }

  withHook(hook: keyof JobHooks, callback: JobTask): IBuildable {
    this.options.hooks = this.options.hooks || {};
    this.options.hooks[hook] = this.options.hooks[hook] || [];
    this.options.hooks[hook].push(callback);
    return this;
  }

  withPriority(priority: number): IBuildable {
    this.options.priority = priority;
    return this;
  }

  withMaxRetries(maxRetries: number): IBuildable {
    this.options.maxRetries = maxRetries;
    return this;
  }

  withRetryDelay(delay: number): IBuildable {
    this.options.retryDelay = delay;
    return this;
  }

  useRetryStrategy(strategy: RetryStrategy): IBuildable {
    this.options.retryStrategy = strategy;
    return this;
  }

  build(): Job {
    if (!this.options.name || !this.options.task || !this.options.schedule) {
      throw new Error('Missing required properties');
    }
    return new Job(this.options as JobOptions);
  }
}
