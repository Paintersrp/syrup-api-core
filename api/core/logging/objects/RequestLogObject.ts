import { Context } from 'koa';
import { User } from '../../models/auth';
import _ from 'lodash';

/**
 * Class representing a log object for each request. It includes details about the request and response,
 * the user making the request, and any error that occurred.
 */
export class RequestLogObject {
  constructor(
    public event: string,
    public method: string,
    public path: string,
    public duration: number,
    public user: string | User,
    public role: string,
    public status: number,
    public responseSize: number,
    public userAgent: string,
    public ipAddress: string,
    public requestBody: unknown,
    public requestId: string,
    public queryParameters?: unknown,
    public error?: {
      message: string;
      stack: string | undefined;
    }
  ) {}

  /**
   * Method to generate a log object for a given request and response.
   *
   * @param ctx - The Koa context object, which includes request and response details.
   * @param startTime - The high-resolution time when the request was received, in nanoseconds.
   * @param err - Any error that occurred while processing the request.
   * @returns A new RequestLogObject instance representing the given request, response, and error.
   */
  static generate(ctx: Context, startTime: bigint, err?: Error): RequestLogObject {
    const duration = Number((process.hrtime.bigint() - startTime) / BigInt(1e6));
    const user: User | string = ctx.state.user?.username || 'Anonymous';
    const role: string = ctx.state.user?.role || 'Unknown';

    let responseSize = 0;
    if (ctx.body) {
      responseSize = Buffer.byteLength(JSON.stringify(ctx.body), 'utf8');
    }

    const logObject = new RequestLogObject(
      'request',
      ctx.method,
      ctx.path,
      duration,
      user,
      role,
      err ? 500 : ctx.status,
      responseSize,
      ctx.request.headers['user-agent'] || '',
      ctx.ip,
      this.sanitizeObject(ctx.request.body),
      ctx.requestId,
      ctx.query
    );

    if (err) {
      logObject.error = {
        message: err.message,
        stack: err.stack,
      };
    }

    return logObject;
  }

  /**
   * Method to sanitize a request body by omitting sensitive fields.
   *
   * @param requestBody - The request body to sanitize.
   * @returns The sanitized request body.
   */
  static sanitizeObject(requestBody: unknown): object {
    const bodyObject = typeof requestBody === 'object' ? requestBody : {};

    const sanitizedBody = bodyObject
      ? _.omit(bodyObject as Record<string, any>, ['password', 'creditCardNumber'])
      : {};

    return sanitizedBody;
  }
}
