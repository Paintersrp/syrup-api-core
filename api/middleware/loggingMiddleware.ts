import Koa from 'koa';
import { User } from '../models';
import _ from 'lodash';

/**
 * Interface for the log object that we generate for each request. It includes details about the request and response,
 * the user making the request, and any error that occurred.
 */
export interface LogObject {
  event: string;
  method: string;
  path: string;
  duration: number; // In milliseconds.
  user: string | User; // The user making the request, or 'Anonymous' if not available.
  role: string; // The role of the user making the request, or 'Unknown' if not available.
  status: number; // The HTTP status code of the response.
  requestBody: unknown; // The body of the request, with sensitive fields omitted.
  error?: {
    message: string;
    stack: string | undefined; // The stack trace of the error, if available.
  };
}

/**
 * Generates a log object for a given request and response.
 *
 * @param ctx - The Koa context object, which includes request and response details.
 * @param startTime - The high-resolution time when the request was received, in nanoseconds.
 * @param err - Any error that occurred while processing the request.
 * @returns A LogObject representing the given request, response, and error.
 */
export function generateLogObject(ctx: Koa.Context, startTime: bigint, err?: Error): LogObject {
  const duration = (process.hrtime.bigint() - startTime) / BigInt(1e6);

  // Get the username and role from the user object in the Koa context state, or use defaults if not available.
  const user: User | string = ctx.state.user?.username || 'Anonymous';
  const role: string = ctx.state.user?.role || 'Unknown';

  // Create the log object. If an error occurred, include its message and stack trace.
  const logObject: LogObject = {
    event: 'request',
    method: ctx.method,
    path: ctx.path,
    duration: Number(duration),
    user,
    role,
    status: err ? 500 : ctx.status,
    requestBody: sanitizeObject(ctx.request.body), // Sanitized to remove sensitive fields.
  };

  if (err) {
    logObject.error = {
      message: err.message,
      stack: err.stack,
    };
  }

  return logObject;
}

/**
 * Sanitizes a request body by omitting sensitive fields.
 *
 * @param requestBody - The request body to sanitize.
 * @returns The sanitized request body.
 */
export function sanitizeObject(requestBody: unknown): object {
  const bodyObject = typeof requestBody === 'object' ? requestBody : {};

  // Omit sensitive fields from the request body.
  const sanitizedBody = bodyObject
    ? _.omit(bodyObject as Record<string, any>, ['password', 'creditCardNumber'])
    : {};

  return sanitizedBody;
}

/**
 * Koa middleware to handle logging requests. Logs the method, path, and user (role).
 * If an error occurs while processing the request, it logs the error and rethrows it.
 *
 * @param ctx - The Koa context object, which includes request and response details.
 * @param next - The next middleware function in the Koa middleware stack.
 */
export const loggingMiddleware: Koa.Middleware = async (ctx, next) => {
  const startTime = process.hrtime.bigint();

  try {
    await next();
  } catch (err) {
    if (isError(err)) {
      ctx.logger.error(generateLogObject(ctx, startTime, err));
    }
    throw err;
  } finally {
    ctx.logger.info(generateLogObject(ctx, startTime));
  }
};

/**
 * Checks if a variable is an instance of the Error class.
 *
 * @param err - The variable to check.
 * @returns True if the variable is an error, false otherwise.
 */
function isError(err: any): err is Error {
  return err instanceof Error;
}
