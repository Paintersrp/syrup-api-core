import Koa from 'koa';
import { loggingMiddleware } from './loggingMiddleware';
import { RequestLogObject } from '../../logging/objects';

describe('loggingMiddleware', () => {
  let ctx: Koa.Context;
  let next: jest.Mock;

  beforeEach(() => {
    ctx = {
      state: {
        user: { username: 'Tom', role: 'admin' },
      },
      logger: {
        error: jest.fn(),
        logRequest: jest.fn(),
      },
      request: {
        headers: { 'user-agent': 'Larry' },
      } as any,
    } as any;

    next = jest.fn();
  });

  it('should call the next middleware if no error is thrown', async () => {
    await loggingMiddleware(ctx, next);
    expect(next).toHaveBeenCalled();
  });

  it('should log the request after processing', async () => {
    const startTime = process.hrtime.bigint();
    const logObject = RequestLogObject.generate(ctx, startTime);

    jest.spyOn(RequestLogObject, 'generate').mockReturnValue(logObject);

    await loggingMiddleware(ctx, next);

    expect(ctx.logger.logRequest).toHaveBeenCalledWith(logObject);
  });

  it('should catch and log an error if thrown', async () => {
    const error = new Error('Test Error');
    next.mockImplementationOnce(() => {
      throw error;
    });

    const startTime = process.hrtime.bigint();
    const logObject = RequestLogObject.generate(ctx, startTime, error);

    jest.spyOn(RequestLogObject, 'generate').mockReturnValue(logObject);

    await expect(loggingMiddleware(ctx, next)).rejects.toThrow(error);

    expect(ctx.logger.error).toHaveBeenCalledWith(logObject);
  });

  it('should rethrow the error if one is caught', async () => {
    const error = new Error('Test Error');
    next.mockImplementationOnce(() => {
      throw error;
    });

    await expect(loggingMiddleware(ctx, next)).rejects.toThrow(error);
  });
});
