import { Context } from 'koa';
import { errorMiddleware } from './errorMiddleware';
import { ErrorLogObject } from '../../logging/objects';

describe('errorMiddleware', () => {
  let ctx: Context;
  let next: jest.Mock;

  beforeEach(() => {
    ctx = {
      requestId: '',
      status: 200,
      body: null,
      request: {
        get: jest.fn().mockReturnValue('Test User-Agent'),
        ip: '127.0.0.1',
      } as any,
      url: '/test',
      method: 'GET',
      state: {
        user: {
          username: 'testUser',
        },
      },
      logger: {
        error: jest.fn(),
      },
    } as any;

    next = jest.fn();
  });

  it('should assign a request ID', async () => {
    await errorMiddleware(ctx, next);
    expect(ctx.requestId).toBeTruthy();
    expect(typeof ctx.requestId).toBe('string');
  });

  it('should call the next middleware if no error is thrown', async () => {
    await errorMiddleware(ctx, next);
    expect(next).toHaveBeenCalled();
  });

  it('should handle and log an error if thrown', async () => {
    const error = new Error('Test Error');
    next.mockImplementationOnce(() => {
      throw error;
    });

    const categorizeAndLogErrorSpy = jest.spyOn(ErrorLogObject.prototype, 'categorizeAndLogError');

    await errorMiddleware(ctx, next);

    expect(categorizeAndLogErrorSpy).toHaveBeenCalled();
    expect(ctx.status).not.toBe(200);
    expect(ctx.body).toBeTruthy();
  });

  it('should categorize and respond with the appropriate error response', async () => {
    const error = new Error('Test Error');
    next.mockImplementationOnce(() => {
      throw error;
    });

    const errorResponse = {
      timestamp: '500',
      requestId: '1',
      path: '/',
      status: 500,
      message: 'Internal Server Error',
      userAgent: 'yeet',
      ipAddress: '127.0.0.1',
      userId: '1',
      requestMethod: 'GET',
      responseStatus: 500,
    };

    jest.spyOn(ErrorLogObject.prototype, 'categorizeAndLogError').mockReturnValue(errorResponse);

    await errorMiddleware(ctx, next);

    expect(ctx.status).toBe(errorResponse.status);
    expect(ctx.body).toEqual(errorResponse);
  });
});
