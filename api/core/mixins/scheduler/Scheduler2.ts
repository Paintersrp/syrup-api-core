import * as cron from 'node-cron';
import { EventEmitter } from 'events';

import { Job } from '../job/Job';
import { Tasks } from './types';

/**
 * The Scheduler class provides methods to schedule, start, stop, and remove jobs.
 * It uses the cron syntax for job scheduling.
 */
export class Scheduler extends EventEmitter {
  private tasks: Tasks = {};

  /**
   * Adds a new job to the scheduler.
   * @param job - The job to be added.
   * @throws Will throw an error if a job with the same name already exists.
   */
  public addJob(job: Job): void {
    if (this.tasks[job.getName()]) {
      throw new Error(`Task with name ${job.getName()} already exists.`);
    }

    const hooks = job.getHooks();
    hooks.onInitialize?.();

    this.tasks[job.getName()] = {
      job,
      instance: cron.schedule(
        job.getSchedule(),
        async () => {
          hooks.onStart?.();

          try {
            job.getTask()();
            hooks.onComplete?.();
            this.emit('taskSuccess', job.getName());
          } catch (err: any) {
            hooks.onError?.(err);
            this.emit('taskError', { name: job.getName(), error: err });
          }
        },
        { scheduled: false }
      ),
    };

    this.emit('taskAdded', job.getName());
    this.tasks[job.getName()].instance?.start();
  }

  /**
   * Removes a job from the scheduler.
   * @param name - The name of the job to be removed.
   * @throws Will throw an error if the job does not exist.
   */
  public removeJob(name: string): void {
    const task = this.tasks[name];

    if (!task) {
      throw new Error(`Task with name ${name} does not exist.`);
    }

    task.instance?.stop();
    task.instance = undefined;

    delete this.tasks[name];
    this.emit('taskRemoved', name);
  }

  /**
   * Starts a job.
   * @param name - The name of the job to be started.
   * @throws Will throw an error if the job does not exist.
   */
  public startJob(name: string): void {
    const task = this.tasks[name];

    if (!task) {
      throw new Error(`Task with name ${name} does not exist.`);
    }

    task.instance?.start();
  }

  /**
   * Stops a job.
   * @param name - The name of the job to be stopped.
   * @throws Will throw an error if the job does not exist.
   */
  public stopJob(name: string): void {
    const task = this.tasks[name];

    if (!task) {
      throw new Error(`Task with name ${name} does not exist.`);
    }

    task.instance?.stop();
  }

  /**
   * Reschedules a job.
   * @param name - The name of the job to be rescheduled.
   * @param schedule - The new schedule for the job.
   * @throws Will throw an error if the job does not exist.
   */
  public rescheduleJob(name: string, schedule: string): void {
    const task = this.tasks[name];

    if (!task) {
      throw new Error(`Task with name ${name} does not exist.`);
    }

    task.instance?.stop();

    this.tasks[name].instance = cron.schedule(
      schedule,
      () => {
        try {
          task.job.getTask()();
          this.emit('taskSuccess', task.job.getName());
        } catch (err) {
          this.emit('taskError', { name: task.job.getName(), error: err });
        }
      },
      { scheduled: false }
    );

    task.job.setSchedule(schedule);
    this.emit('taskRescheduled', { name, newSchedule: schedule });

    this.tasks[name].instance?.start();
  }
}
