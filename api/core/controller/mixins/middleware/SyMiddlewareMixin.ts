import Koa from 'koa';
import Router from 'koa-router';
import * as Yup from 'yup';

import { cache } from '../../../../settings';
import { BadRequestError } from '../../../errors/SyError';
import { ControllerMixinMiddlewareOptions } from '../../types';
import { SyMixin } from '../SyMixin';
/**
 * @todo - Implement a structured logging system for better observability of the application.
 * @todo - Build a strategy for handling edge cases and graceful degradation when the caching system is unavailable.
 * @todo - Design a centralized error handling mechanism that can normalize errors from different parts of the code.
 * @todo - Integrate rate-limiting middleware to prevent API abuse.
 * @todo - Consider using dependency injection for better testability and decoupling of components.
 * @todo - Evaluate if the class structure is the best choice here or if the module pattern would be more suitable.
 * @todo - Implement i18n support for error messages and responses.
 * @todo - Implement metrics collection to measure cache hit rates, validation errors, and more.
 * @todo - Investigate performance improvement options like payload compression, keep-alive HTTP connections, etc.
 * @todo - Design a system for versioning the API endpoints to ensure backward compatibility.
 * @todo - Examine the need for role-based access control (RBAC) in these endpoints.
 * @todo - Evaluate and plan for horizontal scalability of the caching system.
 * @todo - Research on the possibility of leveraging HTTP caching mechanisms (eTag, Last-Modified, etc.).
 * @todo - Add security measures such as XSS and CSRF protection.
 * @todo - Consider using a more sophisticated cache eviction strategy based on Least Recently Used (LRU) or Time Aware Least Recently Used (TARU) algorithms.
 * @todo - Review the need for API request throttling or debouncing.
 * @todo - Conduct a security audit for potential vulnerabilities in the endpoint logic.
 *
 * @todo - Add error handling for cases when caching fails in cacheEndpoint method.
 * @todo - Implement tests for validateBody and cacheEndpoint methods.
 * @todo - Add support for custom error messages in the Yup schema validation.
 * @todo - Include schema validation for request headers and query parameters as well.
 * @todo - Refactor cacheEndpoint to allow varying cache durations based on specific endpoints.
 * @todo - Review and add additional JSDoc comments for better code understanding and maintenance.
 * @todo - Make the caching functionality optional during mixin construction.
 * @todo - Develop a mechanism to invalidate cache entries when the data changes.
 * @todo - Ensure the cache keys are unique even when the URL parameters order changes.
 */

/**
 * SyMiddlewareMixin is a mixin class that extends the base SyMixin.
 * It provides middleware functions for request validation and caching, including bulk operations.
 *
 * @class SyMiddlewareMixin
 * @extends {SyMixin}
 */
export class SyMiddlewareMixin extends SyMixin {
  protected schema: Yup.ObjectSchema<any>;

  /**
   * Constructs a new instance of the Mixin class.
   * @param {MixinOptions} options Options for initiating the Mixin class.
   * @param schema A Yup object schema used for validating request body data.
   */
  constructor(options: ControllerMixinMiddlewareOptions) {
    super(options);
    this.schema = options.schema;
  }

  /**
   * Middleware to validate the request body against the defined schema.
   */
  public async validateBody(ctx: Router.RouterContext, next: Koa.Next) {
    const payload = this.processPayload(ctx);

    const { error } = await this.schema.validate(payload, { abortEarly: false });

    if (error) {
      const errorDetails = `Payload: ${payload}`;
      throw new BadRequestError(error.details[0].message, errorDetails);
    }

    await next();
  }

  /**
   * Middleware to cache the response of an endpoint and serve the cached response if available.
   * If `skip` query parameter is set to 'true', the cache is skipped and the endpoint is processed * normally.
   */
  public async cacheEndpoint(ctx: Router.RouterContext, next: Koa.Next) {
    const skipAndRefreshCache = ctx.query.skip === 'true';
    const cacheKey = `${ctx.method}-${ctx.url}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse && !skipAndRefreshCache) {
      ctx.body = cachedResponse;
      ctx.set('Content-Type', 'application/json');
      return;
    }

    await next();
    await cache.set(cacheKey, ctx.body, 60);
  }
}
