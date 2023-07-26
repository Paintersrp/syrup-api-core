import * as Middleware from '../middleware';
import * as Routes from '../routes';
import { RouteConstructor } from '../types';

/**
 * Collection of views handling user-related API views and controllers.
 */
export const ROUTES: RouteConstructor[] = [
  Routes.UserRoutes,
  Routes.ProfileRoutes,
  Routes.BlacklistRoutes,
  Routes.CacheRoutes,
];

/**
 * Collection of middlewares for the application.
 */
export const MIDDLEWARES = [
  // Add Middlewares Here
  // Middleware.cors(),
  Middleware.helmet(),
  Middleware.bodyParser({
    jsonLimit: '2mb',
  }),
  Middleware.compress(),
  Middleware.responseTime(),
  Middleware.rateLimitMiddleware,
  Middleware.jwtMiddleware,
  Middleware.sessionMiddleware,
  Middleware.loggingMiddleware,
  Middleware.errorMiddleware,
  Middleware.notFoundMiddleware,
  Middleware.serve('public'), // constant for static files?
];

/**
 * Composed middleware function using the middlewares defined in `MIDDLEWARES`.
 */
export const APP_MIDDLEWARES = Middleware.compose(MIDDLEWARES);

/**
 * Secret key for JWT authentication.
 */
export const JWT_SECRET = 'your_jwt_secret_key';
