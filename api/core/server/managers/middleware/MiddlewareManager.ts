import Koa from 'koa';
import compose from 'koa-compose';
import koaCompress from 'koa-compress';
import responseTime from 'koa-response-time';

import {
  errorMiddleware,
  jwtMiddleware,
  loggingMiddleware,
  normalizeMiddleware,
  sessionMiddleware,
} from '../../../middleware';
import { ComposedMiddlewares } from '../../types';
import { sseMiddleware } from '../../../middleware/sse/sseMiddleware';
import { sseManager } from '../../../sse/SSEManager';

/**
 * Class responsible for managing and initializing middleware within a Koa application.
 */
export class MiddlewareManager {
  /**
   * An array containing the internal middleware of the application.
   * These include compression, response time, normalization, JWT, session handling,
   * logging, and error handling.
   */
  protected internalMiddleware = compose([
    koaCompress(),
    responseTime(),
    normalizeMiddleware,
    jwtMiddleware,
    sessionMiddleware,
    loggingMiddleware,
    errorMiddleware,
    sseMiddleware(sseManager),
  ]);

  /**
   * Constructor for the MiddlewareManager class.
   * Initializes internal and external middleware for the given Koa application.
   * @param {Koa} app - The Koa application instance.
   * @param {ComposedMiddlewares} [middleware] - Optional external middleware to apply.
   */
  constructor(app: Koa, middleware?: ComposedMiddlewares) {
    this.initializeMiddleware(app, middleware);
  }

  /**
   * Applies internal middleware to the given Koa application and adds any optional external middleware.
   * @param {Koa} app - The Koa application instance.
   * @param {ComposedMiddlewares} [middleware] - Optional external middleware to apply.
   * @public
   */
  public initializeMiddleware(app: Koa, middleware: ComposedMiddlewares | undefined) {
    if (middleware) {
      app.use(compose([this.internalMiddleware, middleware]));
    } else {
      app.use(this.internalMiddleware);
    }
  }
}
