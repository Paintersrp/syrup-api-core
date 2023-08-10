import { JobCronError } from '../errors/server';
import { JobResponses } from '../lib';
import { JobHooks, JobOptions, JobStatus, JobTask } from './types';

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
  private _schedule: string;
  private _hooks: Partial<JobHooks>;
  private _status: JobStatus = 'idle';
  private _priority: number;
  private _maxRetries: number;
  private _retryCount: number = 0;

  /**
   * Creates a new Job.
   * @param options - The job options including name, task, schedule and hooks.
   */
  constructor(options: JobOptions) {
    try {
      this._name = options.name;
      this.task = options.task;
      this.schedule = options.schedule;
      this._hooks = options.hooks || {};
      this._priority = options.priority || 0;
      this._maxRetries = options.maxRetries || 0;
    } catch (error: any) {
      console.log(error);
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
  public get schedule(): string {
    return this._schedule;
  }

  /**
   * Updates the schedule of the job.
   * @param {string} schedule - The new schedule for the job in cron format.
   * @throws {Error} Will throw an error if the schedule is not in the correct cron format.
   */
  public set schedule(schedule: string) {
    if (!/^(\*\/\d+|\*|\d+)( \(\*\/\d+|\*|\d+\)){4}$/.test(schedule)) {
      throw new JobCronError(JobResponses.INVALID_CRON);
    }
    this._schedule = schedule;
  }

  /**
   * @returns The hooks of the job.
   */
  public get hooks(): Partial<JobHooks> {
    return this._hooks;
  }

  /**
   * Adds a hook to the job.
   * @param {keyof JobHooks} hook - The name of the hook.
   * @param {Function} callback - The function to be called when the hook is triggered.
   */
  public addHook(hook: keyof JobHooks, callback: () => void): void {
    this._hooks[hook] = callback;
  }

  /**
   * Removes a hook from the job.
   * @param {keyof JobHooks} hook - The name of the hook.
   */
  public removeHook(hook: keyof JobHooks): void {
    delete this._hooks[hook];
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
    if (this._status === 'running') {
      this._status = 'paused';
    }
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

  /**
   * Executes the task of the job and updates its status and logs.
   * @throws {Error} Will throw an error if the job fails and has exhausted its maximum retries.
   */
  public async execute(): Promise<void> {
    this._status = 'running';

    try {
      this._hooks.onStart && this._hooks.onStart();
      await this._task();
      this._hooks.onComplete && this._hooks.onComplete();
      this._status = 'completed';
    } catch (err) {
      this._status = 'error';

      if (this._retryCount < this._maxRetries) {
        this._retryCount++;
        await this.execute();
      }
    }
  }
}
