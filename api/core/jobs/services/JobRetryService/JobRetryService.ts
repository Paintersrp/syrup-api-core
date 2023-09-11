import { RetryStrategy } from './types';

export class JobRetryService {
  constructor(
    private strategy: RetryStrategy = 'fixed',
    private maxRetries: number = 0,
    private delay: number = 1000
  ) {}

  setStrategy(strategy: RetryStrategy, maxRetries: number, delay?: number): void {
    this.strategy = strategy;
    this.maxRetries = maxRetries;
    if (delay) this.delay = delay;
  }

  async execute(task: () => Promise<void>): Promise<void> {
    if (this.maxRetries === 0) {
      await task();
      return;
    }

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        await task();
        break;
      } catch (err) {
        if (attempt < this.maxRetries) {
          await this.sleep(this.getDelay(attempt));
        } else {
          throw err;
        }
      }
    }
  }

  private getDelay(attempt: number): number {
    if (this.strategy === 'exponential') {
      return this.delay * Math.pow(2, attempt);
    } else {
      return this.delay;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
