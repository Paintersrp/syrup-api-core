import * as cron from 'node-cron';
import { Logger } from 'pino';

import { Task, Tasks } from './types';
import { Job } from '../jobs';
import { Emitter } from '../emitter';
import { JobResponses } from '../lib';
import { LoggerController } from '../logging/controller';
import { LoggerDefaults } from '../logging/defaults';
import { LoggerNames } from '../logging/enums';

/**
 * The Scheduler class provides methods to schedule, start, stop, and remove jobs.
 * It uses the cron syntax for job scheduling.
 */
export class Scheduler {
  private tasks: Tasks = {};
  private emitter: Emitter;
  private logger: Logger;

  /**
   * Scheduler class constructor.
   * @constructor
   */
  constructor() {
    this.emitter = new Emitter();
    this.logger = new LoggerController(LoggerDefaults[LoggerNames.APP]).logger;
  }

  /**
   * Returns a job by its name.
   * @public
   * @param name - The name of the job.
   * @returns The job instance, or undefined if no job with the given name exists.
   */
  public getJob(name: string): Job | undefined {
    return this.tasks[name]?.job;
  }

  /**
   * Checks if a job with the given name exists.
   * @public
   * @param name - The name of the job.
   * @returns True if the job exists, false otherwise.
   */
  public jobExists(name: string): boolean {
    return !!this.tasks[name];
  }

  /**
   * Adds a new job to the scheduler.
   * @param job - The job to be added.
   * @throws Will throw an error if a job with the same name already exists.
   */
  public addJob(job: Job): void {
    if (this.jobExists(job.name)) {
      this.logger.info(JobResponses.JOB_DUPLICATION(job.name));
    }

    job.hooks.onInitialize?.();

    const task = cron.schedule(job.schedule, this.createJobRunner(job), { scheduled: false });
    this.tasks[job.name] = { job, instance: task };

    this.emitter.setGroup('jobs', job.name);
    this.emitter.emit('taskAdded', job.name);
    task.start();
  }

  /**
   * Removes a job from the scheduler.
   * @param name - The name of the job to be removed.
   * @throws Will throw an error if the job does not exist.
   */
  public removeJob(name: string): void {
    const task = this.assertTask(name);
    task.instance?.stop();
    delete this.tasks[name];
    this.emitter.emit('taskRemoved', name);
  }

  /**
   * Starts a job.
   * @param name - The name of the job to be started.
   * @throws Will throw an error if the job does not exist.
   */
  public startJob(name: string): void {
    const task = this.assertTask(name);
    task.instance?.start();
  }

  /**
   * Stops a job.
   * @param name - The name of the job to be stopped.
   * @throws Will throw an error if the job does not exist.
   */
  public stopJob(name: string): void {
    const task = this.assertTask(name);
    task.instance?.stop();
  }

  /**
   * Reschedules a job.
   * @param name - The name of the job to be rescheduled.
   * @param schedule - The new schedule for the job.
   * @throws Will throw an error if the job does not exist.
   */
  public rescheduleJob(name: string, schedule: string): void {
    const task = this.assertTask(name);
    task.instance?.stop();

    this.tasks[name].instance = cron.schedule(schedule, this.createJobRunner(task.job), {
      scheduled: false,
    });

    task.job.schedule = schedule;
    this.emitter.emit('taskRescheduled', { name, newSchedule: schedule });

    this.tasks[name].instance?.start();
  }

  /**
   * Creates a job runner for a job.
   * @private
   * @param job - The job for which to create a job runner.
   * @returns A function that executes the job and handles errors.
   */
  private createJobRunner(job: Job) {
    return async () => {
      try {
        await job.execute();
        this.emitter.emit('taskSuccess', job.name);
      } catch (err: any) {
        job.hooks.onError?.(err);
        this.emitter.emit('taskError', { name: job.name, error: err });
      }
    };
  }

  /**
   * Retrieves a task by its name.
   * @private
   * @param name - The name of the task.
   * @returns The task instance.
   * @throws Will log an info message if the task does not exist.
   */
  private assertTask(name: string): Task {
    const task = this.tasks[name];
    if (!task) {
      this.logger.info(JobResponses.JOB_NOT_FOUND(name));
    }
    return task;
  }
}
