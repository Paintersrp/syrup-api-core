import { Context } from 'koa';
import { RequestLogObject } from '../RequestLogObject';

describe('RequestLogObject', () => {
  let ctx: Context;
  const startTime: bigint = BigInt(0);
  const mockedTime: bigint = BigInt(1000000);

  beforeEach(() => {
    jest.spyOn(process.hrtime, 'bigint').mockReturnValue(mockedTime);
    ctx = {
      state: { user: { username: 'John', role: 'Admin' } },
      method: 'POST',
      path: '/test',
      status: 200,
      body: { data: 'test' },
      request: {
        headers: { 'user-agent': 'test-agent' },
        body: { data: 'test', password: 'secret' },
      },
      query: { search: 'Tom' },
      ip: '127.0.0.1',
      requestId: '12345',
    } as unknown as Context;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generate', () => {
    it('should create a RequestLogObject instance with the given parameters', () => {
      const logObject = RequestLogObject.generate(ctx, startTime);

      console.log(logObject.queryParameters);

      expect(logObject.event).toBe('request');
      expect(logObject.method).toBe('POST');
      expect(logObject.path).toBe('/test');
      expect(logObject.duration).toBe(1);
      expect(logObject.user).toBe('John');
      expect(logObject.role).toBe('Admin');
      expect(logObject.status).toBe(200);
      expect(logObject.responseSize).toBe(15);
      expect(logObject.userAgent).toBe('test-agent');
      expect(logObject.ipAddress).toBe('127.0.0.1');
      expect(logObject.requestBody).toEqual({ data: 'test' });
      expect(logObject.requestId).toBe('12345');
      expect(logObject.queryParameters).toEqual({ search: 'Tom' });
    });

    it('should include error details if provided', () => {
      const err = new Error('Test Error');
      err.stack = 'stack trace';
      const logObject = RequestLogObject.generate(ctx, startTime, err);

      expect(logObject.error).toEqual({
        message: 'Test Error',
        stack: 'stack trace',
      });
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize the request body by omitting sensitive fields', () => {
      const requestBody = { username: 'John', password: 'secret', creditCardNumber: '1234' };
      const sanitizedBody = RequestLogObject.sanitizeObject(requestBody);

      expect(sanitizedBody).toEqual({ username: 'John' });
    });

    it('should return an empty object if the request body is not an object', () => {
      const sanitizedBody = RequestLogObject.sanitizeObject('not-an-object');

      expect(sanitizedBody).toEqual({});
    });
  });
});
