import { JobHooks, JobTask } from './types';

/**
 * The Job class represents a job to be scheduled.
 * It contains a name, task, schedule, and optional lifecycle hooks.
 */
export class Job {
  private name: string;
  private task: JobTask;
  private schedule: string;
  private hooks: JobHooks;

  /**
   * Creates a new Job.
   * @param name - The name of the job.
   * @param task - The task to be executed when the job runs.
   * @param schedule - The schedule for the job in cron format.
   * @param hooks - Optional lifecycle hooks for the job.
   */
  constructor(name: string, task: JobTask, schedule: string, hooks: JobHooks = {}) {
    this.name = name;
    this.task = task;
    this.schedule = schedule;
    this.hooks = hooks;
  }

  public getName(): string {
    return this.name;
  }

  public getTask(): JobTask {
    return this.task;
  }

  public getSchedule(): string {
    return this.schedule;
  }

  public setSchedule(schedule: string): void {
    this.schedule = schedule;
  }

  public getHooks(): JobHooks {
    return this.hooks;
  }
}
