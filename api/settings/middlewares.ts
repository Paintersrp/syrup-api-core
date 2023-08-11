import { ComposedMiddleware } from 'koa-compose';
import * as Middleware from '../middleware';
import { STATIC_DIR } from './general';

/**
 * @todo Syrup Internal Middlewares
 * @todo add your middlewares here section
 */
export const MIDDLEWARES = Middleware.compose([
  Middleware.cors(),
  // Middleware.circuitBreakerMiddleware,
  Middleware.helmetMiddleware,
  Middleware.bodyParser({
    jsonLimit: '2mb',
  }),
  Middleware.rateLimitMiddleware,
  Middleware.maintenanceMiddleware,
  Middleware.serve(STATIC_DIR),
]) as ComposedMiddleware<any>;
