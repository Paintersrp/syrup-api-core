import { Context, Request } from 'koa';
import { Monitor } from '../Monitor';

describe('Monitor', () => {
  it('should log performance metrics and execute the original method', async () => {
    // Mock Koa context
    const ctx: Partial<Context> = {
      method: 'GET',
      path: '/test',
      status: 200,
      get: jest.fn().mockReturnValue('test-agent'),
      logger: {
        logAccess: jest.fn(),
        error: jest.fn(),
      },
    };

    // Mock next function
    const next = jest.fn();

    // Function to be decorated
    async function someFunction() {
      // Do something
    }

    // Applying the Monitor decorator
    const descriptor = {
      value: someFunction,
    };
    const decoratedDescriptor = Monitor(null, 'someFunction', descriptor);

    // Execute the decorated function
    await decoratedDescriptor.value(ctx as Context, next);

    // Verify that the logAccess method was called
    expect(ctx.logger.logAccess).toHaveBeenCalled();

    // Destructure the first call argument
    const logArgs = ctx.logger.logAccess.mock.calls[0][0];

    // Assert individual properties
    expect(logArgs.key).toBe('someFunction');
    expect(typeof logArgs.executionTime).toBe('number');
    expect(logArgs.method).toBe('GET');
    expect(logArgs.path).toBe('/test');
    expect(logArgs.status).toBe(200);
    expect(logArgs.userAgent).toBe('test-agent');
    expect(typeof logArgs.memoryUsageDiff).toBe('string');
    expect(typeof logArgs.cpuUsage).toBe('string');
    expect(Array.isArray(logArgs.loadAvg)).toBe(true);
  });

  it('should log an error and re-throw it if an exception occurs', async () => {
    // Mock Koa context
    const ctx: Partial<Context> = {
      get: jest.fn().mockReturnValue('test-agent'),
      request: {
        body: {},
      } as Request,
      logger: {
        logAccess: jest.fn(),
        error: jest.fn(),
      },
    };

    // Mock next function
    const next = jest.fn();

    // Function to be decorated that throws an error
    async function someFunction() {
      throw new Error('Test error');
    }

    // Applying the Monitor decorator
    const descriptor = {
      value: someFunction,
    };
    const decoratedDescriptor = Monitor(null, 'someFunction', descriptor);

    // Expecting the decorated function to throw an error
    await expect(decoratedDescriptor.value(ctx as Context, next)).rejects.toThrow('Test error');

    // Verifying that the error method was called with correct details
    expect(ctx.logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'someFunction',
        error: {
          message: 'Test error',
          stack: expect.any(String),
        },
      })
    );
  });
});
