import { Interval } from '../core/lib';
import { logger } from './loggers';

/**
 * Schedules a task to be executed at a specified interval.
 * @param {() => Promise<void>} task - The task to be executed.
 * @param {number} duration - The duration in milliseconds between each execution of the task.
 * @param {boolean} execute - Flag indicating whether the task should be executed immediately.
 * @returns {NodeJS.Timeout} - The interval ID returned by `setInterval`.
 */
export function schedule(
  task: () => Promise<void>,
  duration: number,
  execute: boolean = false
): NodeJS.Timeout {
  const executeTask = async (): Promise<void> => {
    try {
      await task();
    } catch (error) {
      logger.error('Error occurred while executing the scheduled task:', error);
    }
  };

  if (execute) {
    executeTask();
  }

  const intervalId = setInterval(executeTask, duration);
  return intervalId;
}

// schedule(async () => {
//   Request.deleteOldRequests();
// }, Interval.Biweekly);
