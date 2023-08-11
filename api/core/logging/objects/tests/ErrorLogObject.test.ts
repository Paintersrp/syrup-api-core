import { Context } from 'koa';
import { ValidationError } from 'sequelize';
import { ErrorLogObject } from '../ErrorLogObject';
import { BadRequestError } from '../../../errors/client';
import { HttpStatus } from '../../../lib';
import { ErrorCodes } from '../../../errors/enums';

describe('ErrorLogObject', () => {
  let ctx: Context;
  let badRequestError: BadRequestError;

  beforeEach(() => {
    ctx = {
      requestId: '12345',
      url: '/test',
      request: {
        get: jest.fn().mockReturnValue('test-agent'),
        ip: '127.0.0.1',
        method: 'GET',
        headers: {},
        body: {},
      },
      method: 'GET',
      status: 200,
      state: { user: { username: 'John' } },
      logger: { error: jest.fn(), info: jest.fn() },
    } as unknown as Context;

    badRequestError = new BadRequestError('Test Error');
  });

  describe('constructor', () => {
    it('should initialize properties correctly', () => {
      const errorLog = new ErrorLogObject(badRequestError, ctx);

      expect(errorLog.error).toBe(badRequestError);
      expect(errorLog.requestId).toBe('12345');
      expect(errorLog.path).toBe('/test');
      expect(errorLog.userAgent).toBe('test-agent');
      expect(errorLog.ipAddress).toBe('127.0.0.1');
      expect(errorLog.userId).toBe('John');
      expect(errorLog.requestMethod).toBe('GET');
      expect(errorLog.responseStatus).toBe(200);
    });
  });

  describe('categorizeAndLogError', () => {
    // it('should handle BadRequestError correctly', () => {
    //   const errorLog = new ErrorLogObject(badRequestError, ctx);
    //   const result = errorLog.categorizeAndLogError();

    //   const expectedResponse = {
    //     status: HttpStatus.BAD_REQUEST,
    //     message: 'Test Error',
    //     requestId: '12345',
    //     path: '/test',
    //     userAgent: 'test-agent',
    //     ipAddress: '127.0.0.1',
    //     requestMethod: 'GET',
    //     responseStatus: 200,
    //     timestamp: result.timestamp,
    //     userId: 'John',
    //     stack: result.stack,
    //   };

    //   expect(ctx.logger.error).toHaveBeenCalledWith('Test Error', {
    //     status: HttpStatus.BAD_REQUEST,
    //     code: ErrorCodes.BAD_REQUEST,
    //     details: undefined,
    //     internalErrorCode: undefined,
    //     timestamp: result.timestamp,
    //     stack: expectedResponse.stack,
    //     requestId: '12345',
    //     user: { username: 'John' },
    //     request: {
    //       method: 'GET',
    //       url: undefined,
    //       headers: {},
    //       body: {},
    //     },
    //   });
    // });

    it('should handle other errors correctly', () => {
      const genericError = new Error('Generic Error');
      const errorLog = new ErrorLogObject(genericError, ctx);
      const result = errorLog.categorizeAndLogError();

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe('Internal Server Error');
      expect(ctx.logger.error).toHaveBeenCalledWith(genericError);
    });
  });
});
