import { Queue } from '../../../structures';

export class QueueManager<T extends () => void> {
  private taskQueue: Queue<T>;
  private processDelay: number;

  constructor(processDelay: number = 50) {
    this.taskQueue = new Queue<T>();
    this.processDelay = processDelay;
  }

  public processQueue() {
    if (!this.taskQueue.isEmpty()) {
      const task = this.taskQueue.dequeue();
      if (task) {
        task();
      }
    }

    setTimeout(() => this.processQueue(), this.processDelay);
  }

  public getQueue() {
    return this.taskQueue;
  }
}
