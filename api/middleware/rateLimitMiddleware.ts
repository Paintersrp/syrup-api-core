import rateLimit from 'koa-ratelimit';

/**
 * Koa middleware to handle rate limiting requests.
 */
export const rateLimitMiddleware = rateLimit({
  driver: 'memory',
  db: new Map(),
  duration: 60000,
  max: 100,
  errorMessage: 'Too many requests, please try again later.',
});
