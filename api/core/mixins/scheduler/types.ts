import { ScheduledTask } from 'node-cron';
import { Job } from '../job/Job';

export interface Task {
  job: Job;
  instance?: ScheduledTask;
}

export type Tasks = Record<string, Task>;
