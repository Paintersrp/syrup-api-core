import Koa from 'koa';
import Router from 'koa-router';
import * as Yup from 'yup';

import { cache } from '../../../../settings';
import { BadRequestError } from '../../../errors/SyError';
import { ControllerMixinMiddlewareOptions } from '../../types';
import { SyMixin } from '../SyMixin';

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
    const cacheKey = `${ctx.method}-${ctx.url}` as unknown as number;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse && !skipAndRefreshCache) {
      ctx.body = cachedResponse;
      ctx.set('Content-Type', 'application/json');
      return;
    }

    await next();
    cache.set(cacheKey, ctx.body as unknown as number, 60);
  }
}
