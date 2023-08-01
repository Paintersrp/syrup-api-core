import CircuitBreaker, { Options } from 'opossum';
import { Context, Middleware, Next } from 'koa';
import { APP_LOGGER } from '../settings';

/**
 * Should be handled like a cache? Redis Server?
 * In order to maintain a potentially large circuit breaker, and to also shared across scaling strategies
 */

const options: Options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the breaker
  resetTimeout: 30000, // After 30 seconds, try again
  rollingCountTimeout: 10000, // Sets the duration of the statistical rolling window
  volumeThreshold: 10, // Minimum number of requests to trip the circuit
  name: 'Global',
};

// Separate breaker for each path
const breakers = new Map<string, CircuitBreaker>();

function getBreakerForPath(path: string): CircuitBreaker {
  if (!breakers.has(path)) {
    breakers.set(
      path,
      new CircuitBreaker(async (ctx: Context, next: Next) => {
        try {
          await next();
        } catch (err: any) {
          APP_LOGGER.trace(`[Circuit Breaker] ${path} error: ${err.message}`);
          throw err;
        }
        return ctx;
      }, options)
    );
  }

  return breakers.get(path)!;
}

export const circuitBreakerMiddleware: Middleware = async (ctx, next) => {
  const breaker = getBreakerForPath(ctx.path);

  breaker.fallback((ctx: Context) => {
    ctx.status = 503;
    ctx.body = { message: 'Service Temporarily Unavailable' };
  });

  breaker.on('open', () =>
    APP_LOGGER.trace(
      `[Circuit Breaker] ${ctx.path} is in OPEN state. The breaker will short-circuit all requests to fallback.`
    )
  );
  breaker.on('halfOpen', () =>
    APP_LOGGER.trace(
      `[Circuit Breaker] ${ctx.path} is in HALF-OPEN state. The breaker will allow a request to test the health of the main action.`
    )
  );
  breaker.on('close', () =>
    APP_LOGGER.trace(
      `[Circuit Breaker] ${ctx.path} is in CLOSED state. The breaker is allowing requests to execute through.`
    )
  );

  // Log when action is executed, rejected, timed out or fails.
  breaker.on('fire', () =>
    APP_LOGGER.trace(`[Circuit Breaker] ${ctx.path} Action execution attempt.`)
  );
  breaker.on('reject', () =>
    APP_LOGGER.trace(`[Circuit Breaker] ${ctx.path} Request rejected due to open circuit breaker.`)
  );
  breaker.on('timeout', () =>
    APP_LOGGER.trace(`[Circuit Breaker] ${ctx.path} Action execution timed out.`)
  );
  breaker.on('failure', (error) =>
    APP_LOGGER.trace(`[Circuit Breaker] ${ctx.path} Action execution failed: ${error.message}`)
  );
  breaker.on('success', () =>
    APP_LOGGER.trace(`[Circuit Breaker] ${ctx.path} Action execution succeeded.`)
  );

  const result = (await breaker.fire(ctx, next)) as Context;

  if (result.status === 503) {
    ctx.status = result.status;
    ctx.body = result.body;
  }
};
