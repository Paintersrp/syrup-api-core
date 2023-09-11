import { JobCronError } from '../errors/cron';
import { JobResponses } from '../lib';
import { JobLifecycle } from './services/JobLifecycle/JobLifecycle';
import { JobMiddleware } from './services/JobMiddleware/JobMiddleware';
import { JobMiddlewareType } from './services/JobMiddleware/types';
import { JobRetryService } from './services/JobRetryService/JobRetryService';
import { RetryStrategy } from './services/JobRetryService/types';
import { JobHooks, JobOptions, JobStatus, JobTask } from './types';

export type ScheduleConfig = {
  cron: string | null;
  time?: string;
  timeZone?: string;
  excludeWeekends?: boolean;
  excludeHolidays?: Date[];
};

/**
 * The Job class represents a job to be scheduled.
 * It contains a name, task, schedule, and optional lifecycle hooks.
 *
 * @property {string} _name - The name of the job.
 * @property {JobTask} _task - The task to be executed when the job runs.
 * @property {string} _schedule - The schedule for the job in cron format.
 * @property {Partial<JobHooks>} _hooks - Optional lifecycle hooks for the job.
 * @property {JobStatus} _status - The current status of the job.
 * @property {string[]} _logs - Logs related to the job.
 * @property {number} _priority - The priority of the job.
 * @property {number} _maxRetries - Maximum number of retries for the job if it fails.
 * @property {number} _retryCount - Current number of retries for the job.
 */
export class Job {
  private readonly _name: string;
  private _task: JobTask;
  private _schedule: ScheduleConfig = { cron: '' };
  private _status: JobStatus = 'idle';
  private _priority: number;

  private _retryCount: number = 0;

  private _lifecycle: JobLifecycle;
  private _middlewareService: JobMiddleware;
  private _retryService: JobRetryService;

  /**
   * Creates a new Job.
   * @param options - The job options including name, task, schedule and hooks.
   */
  constructor(options: JobOptions) {
    this._name = options.name;
    this.task = options.task;
    this.schedule = options.schedule.cron!;
    this._priority = options.priority || 0;

    this._lifecycle = new JobLifecycle(options.hooks);
    this._middlewareService = new JobMiddleware();
    this._retryService = new JobRetryService(
      options.retryStrategy,
      options.maxRetries,
      options.retryDelay
    );

    if (options.middleware) {
      for (const middleware of options.middleware) {
        this._middlewareService.use(middleware);
      }
    }
  }

  /**
   * @returns The name of the job.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * @returns The task of the job.
   */
  public get task(): JobTask {
    return this._task;
  }

  /**
   * Updates the task of the job.
   * @param {JobTask} task - The new task for the job.
   */
  public set task(task: JobTask) {
    this._task = task;
  }

  /**
   * @returns The schedule of the job.
   */
  public get schedule(): ScheduleConfig {
    return this._schedule;
  }

  /**
   * Updates the schedule of the job.
   * @param {string} schedule - The new schedule for the job in cron format.
   * @throws {Error} Will throw an error if the schedule is not in the correct cron format.
   */
  public set schedule(schedule: string) {
    if (!/^(\*\/\d+|\*|\d+)( (\*\/\d+|\*|\d+)){4}$/.test(schedule)) {
      throw new JobCronError(JobResponses.INVALID_CRON);
    }
    this._schedule.cron = schedule;
  }

  /**
   * @returns The hooks of the job.
   */
  public get hooks(): Partial<JobHooks> {
    return this._lifecycle.getHooks();
  }

  /**
   * Adds a hook to the job.
   * @param {keyof JobHooks} hook - The name of the event.
   * @param {HookCallback} callback - The function to be called when the hook is triggered.
   */
  addHook(hook: keyof JobHooks, callback: JobTask): void {
    this._lifecycle.registerHook(hook, callback);
  }

  /**
   * Removes a hook from the job.
   * @param {keyof JobHooks} hook - The name of the hook.
   */
  removeHook(hook: keyof JobHooks, callback: JobTask): void {
    this._lifecycle.unregisterHook(hook, callback);
  }

  //doc
  useMiddleware(middleware: JobMiddlewareType): void {
    this._middlewareService.use(middleware);
  }

  /**
   * @returns The status of the job.
   */
  public get status(): JobStatus {
    return this._status;
  }

  /**
   * @returns The priority of the job.
   */
  public get priority(): number {
    return this._priority;
  }

  /**
   * @returns The current retry count for the job.
   */
  public get retryCount(): number {
    return this._retryCount;
  }

  /**
   * Pauses the job if it's currently running.
   */
  public pause(): void {
    this._status = 'paused';
  }

  /**
   * Resumes the job if it's currently paused, and re-executes the task.
   */
  public async resume(): Promise<void> {
    if (this._status === 'paused') {
      this._status = 'running';
      await this.execute();
    }
  }

  setRetryStrategy(strategy: RetryStrategy, maxRetries: number, delay?: number): void {
    this._retryService.setStrategy(strategy, maxRetries, delay);
  }

  /**
   * Executes the task of the job and updates its status and logs.
   * @throws {Error} Will throw an error if the job fails and has exhausted its maximum retries.
   */
  async execute(): Promise<void> {
    this._status = 'running';
    await this._lifecycle.executeHook('onStart');
    await this._middlewareService.execute(this);

    try {
      await this._retryService.execute(() => this.executeTask());
    } catch (err) {
      this._status = 'error';
    }
  }

  private async executeTask(): Promise<void> {
    try {
      await this._task();
      await this._lifecycle.executeHook('onComplete');
      this._status = 'completed';
    } catch (err) {
      await this._lifecycle.executeHook('onError');
      this._status = 'error';
    }
  }
}
