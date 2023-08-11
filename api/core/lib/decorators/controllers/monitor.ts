import os from 'os';
import { Context, Next } from 'koa';

/**
 * @todo Worker process queue for scaling
 * @todo Enhanced metric collection and processing
 * @todo Event Loop
 */

/**
 * Monitor is a decorator that logs the performance metrics of the decorated function. It logs
 * execution time, memory usage, cpu usage and load average to a monitoringLogger.
 *
 * @example
 *
 * *@Monitor
 * async someFunction(ctx: Context, next: Next) {}
 */
export function Monitor(_: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (ctx: Context, next: Next) {
    const startHrTime = process.hrtime();
    const startMemUsage = process.memoryUsage().rss;

    try {
      await originalMethod.call(this, ctx, next);
    } catch (error: any) {
      ctx.logger.error({
        key,
        error: {
          message: error.message,
          stack: error.stack,
        },
        requestBody: ctx.request.body,
      });
      throw error;
    } finally {
      const hrTime = process.hrtime(startHrTime);
      const endMemUsage = process.memoryUsage().rss;
      const memUsageDiff = `${(endMemUsage - startMemUsage) / (1024 * 1024)}mb`;
      const executionTime = hrTime[0] * 1e3 + hrTime[1] / 1e6;

      ctx.logger.logAccess({
        key,
        executionTime,
        method: ctx.method,
        path: ctx.path,
        status: ctx.status,
        userAgent: ctx.get('User-Agent'),
        memoryUsageDiff: memUsageDiff,
        cpuUsage: `${process.cpuUsage().user / 1000}ms`,
        loadAvg: os.loadavg(),
      });
    }
  };

  return descriptor;
}
