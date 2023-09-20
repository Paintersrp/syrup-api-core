import { Queue } from '../../../structures';

/**
 * @class QueueManager
 * Manages the processing of a queue of tasks.
 * Tasks are processed in a First-In-First-Out (FIFO) manner with a defined delay between each task.
 * @template T - The type of task function.
 */
export class QueueManager<T extends () => void> {
  private taskQueue: Queue<T>;
  private processDelay: number;

  /**
   * @constructor
   * Creates an instance of QueueManager.
   * @param {number} [processDelay=50] - The delay in milliseconds between each task processing. Defaults to 50.
   */
  constructor(processDelay: number = 50) {
    this.taskQueue = new Queue<T>();
    this.processDelay = processDelay;
  }

  /**
   * @public
   * Initiates the processing of the task queue.
   * Will recursively call itself with the defined `processDelay` to ensure continuous processing.
   */
  public processQueue() {
    if (!this.taskQueue.isEmpty()) {
      const task = this.taskQueue.dequeue();
      if (task) {
        task();
      }
    }

    setTimeout(() => this.processQueue(), this.processDelay);
  }

  /**
   * @public
   * Returns the current state of the task queue.
   * @returns {Queue<T>} - The current task queue.
   */
  public getQueue(): Queue<T> {
    return this.taskQueue;
  }
}
