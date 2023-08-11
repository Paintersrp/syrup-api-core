import { Context, Next } from 'koa';
import { Retry } from '../Retry';

describe('Retry', () => {
  class TestClass {
    @Retry()
    async someFunction(ctx: Context, next: Next): Promise<boolean> {
      console.log(ctx.state.retries);
      if (ctx.state.retries < 2) {
        ctx.state.retries++;
        throw new Error('Test Error');
      }

      if (ctx.state.retries > 3) {
        return false;
      }

      return true;
    }

    @Retry({ exponentialBackoff: true, retryDelay: 10 })
    async anotherFunction(ctx: Context, next: Next): Promise<boolean> {
      if (ctx.state.retries < 1) {
        ctx.state.retries++;
        throw new Error('Test Error');
      }
      return true;
    }
  }

  const ctx: any = { state: { retries: 0 } };
  const next = jest.fn();

  beforeEach(() => {
    ctx.state.retries = 0;
  });

  it('should call the original method if no error is thrown', async () => {
    const testInstance = new TestClass();
    await expect(testInstance.someFunction(ctx, next)).resolves.toBe(true);
  });

  it('should retry the original method if an error is thrown', async () => {
    const testInstance = new TestClass();
    ctx.state.retries = 1;
    await expect(testInstance.someFunction(ctx, next)).resolves.toBe(true);
  });

  it('should exponentially backoff if exponentialBackoff is true', async () => {
    const testInstance = new TestClass();
    await expect(testInstance.anotherFunction(ctx, next)).resolves.toBe(true);
  });

  it('should return false after max retry attempts reached', async () => {
    const testInstance = new TestClass();
    ctx.state.retries = 4;
    await expect(testInstance.someFunction(ctx, next)).resolves.toBe(false);
  });
});
