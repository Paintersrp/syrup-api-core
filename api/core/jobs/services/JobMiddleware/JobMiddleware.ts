import { Job } from '../../Job';
import { JobMiddlewareType } from './types';

export class JobMiddleware {
  private readonly middlewares: JobMiddlewareType[] = [];

  use(middleware: JobMiddlewareType): void {
    this.middlewares.push(middleware);
  }

  async execute(job: Job): Promise<void> {
    let next: () => Promise<void> = async () => Promise.resolve();

    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i];
      const currentNext = next;
      next = async () => middleware(job, currentNext);
    }

    // Start the chain.
    await next();
  }
}
