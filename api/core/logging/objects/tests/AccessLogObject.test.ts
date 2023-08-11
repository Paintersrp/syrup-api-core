import Koa from 'koa';
import { AccessLogObject } from '../AccessLogObject';

describe('AccessLogObject', () => {
  let ctx: Koa.Context;

  beforeEach(() => {
    ctx = {
      state: { user: { username: 'John', role: 'Admin' } },
      method: 'GET',
      path: '/test',
      status: 200,
      requestId: '12345',
      request: { method: 'GET', url: '/test' },
      header: { 'user-agent': 'test-agent' },
      ip: '127.0.0.1',
      logger: { info: jest.fn() },
    } as unknown as Koa.Context;
  });

  describe('constructor', () => {
    it('should initialize properties correctly', () => {
      const accessLog = new AccessLogObject(ctx, 'ALLOW', 'Test Reason', 'Test Rule');

      expect(accessLog.event).toBe('access_control');
      expect(accessLog.method).toBe('GET');
      expect(accessLog.path).toBe('/test');
      expect(accessLog.status).toBe(200);
      expect(accessLog.user).toBe('John');
      expect(accessLog.role).toBe('Admin');
      expect(accessLog.access).toBe('ALLOW');
      expect(accessLog.reason).toBe('Test Reason');
      expect(accessLog.requestId).toBe('12345');
      expect(accessLog.action).toBe('GET');
      expect(accessLog.resource).toBe('/test');
      expect(accessLog.rule).toBe('Test Rule');
      expect(accessLog.userAgent).toBe('test-agent');
      expect(accessLog.ipAddress).toBe('127.0.0.1');
    });
  });

  describe('toLogEntry', () => {
    it('should return the log entry object', () => {
      const accessLog = new AccessLogObject(ctx, 'ALLOW', 'Test Reason', 'Test Rule');
      const logEntry = accessLog.toLogEntry();

      expect(logEntry).toEqual({
        event: 'access_control',
        method: 'GET',
        path: '/test',
        status: 200,
        user: 'John',
        role: 'Admin',
        access: 'ALLOW',
        reason: 'Test Reason',
        requestId: '12345',
        action: 'GET',
        resource: '/test',
        rule: 'Test Rule',
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
      });
    });
  });

  describe('log', () => {
    it('should log the entry object', () => {
      const accessLog = new AccessLogObject(ctx, 'ALLOW', 'Test Reason', 'Test Rule');
      accessLog.log(ctx);

      expect(ctx.logger.info).toHaveBeenCalledWith(accessLog.toLogEntry());
    });
  });
});
