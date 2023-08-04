import Koa from 'koa';
import Router from 'koa-router';
import * as Yup from 'yup';
import { AuditAction, AuditLog } from '../../../model/auditlog';

import { cache, CACHE } from '../../../../settings';
import { BadRequestError } from '../../../errors/client';
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

    try {
      await this.schema.validate(payload, { abortEarly: false });
    } catch (error: any) {
      const errorDetails = `Payload: ${payload}`;
      // Join all error messages into a single string.
      const errorMessage = error.inner.map((e: any) => e.message).join(', ');
      throw new BadRequestError(errorMessage, errorDetails);
    }

    await next();
  }

  /**
   * Middleware to cache the response of an endpoint and serve the cached response if available.
   * If `skip` query parameter is set to 'true', the cache is skipped and the endpoint is processed * normally.
   */
  public async cacheEndpoint(ctx: Router.RouterContext, next: Koa.Next) {
    console.log({ ...this.model });
    const skipAndRefreshCache = ctx.query.skip === 'true';
    const cacheKey = `${ctx.method}-${ctx.url}` as unknown as number;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse && !skipAndRefreshCache) {
      ctx.body = cachedResponse;
      ctx.set('Content-Type', 'application/json');
      return;
    }

    await next();
    cache.set(cacheKey, ctx.body as unknown as number, CACHE.OPTIONS.defaultTTL);
  }

  /**
   * OPTIONS endpoint middleware.
   * @param {Router.RouterContext} ctx - The Koa router context.
   * @param {() => Promise<any>} next The next middleware function.
   */
  public async options(ctx: Router.RouterContext, next: () => Promise<any>) {
    ctx.set('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    ctx.status = 200;
    ctx.body = {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    };
    await next();
  }

  // public async auditLogMiddleware(ctx: Router.RouterContext, next: Koa.Next) {
  //   const originalData = { ...this.model };

  //   await next();

  //   let action;
  //   switch (ctx.method) {
  //     case 'POST':
  //       action = AuditAction.CREATE;
  //       break;
  //     case 'PUT':
  //     case 'PATCH':
  //       action = AuditAction.UPDATE;
  //       break;
  //     case 'DELETE':
  //       action = AuditAction.DELETE;
  //       break;
  //     default:
  //       return;
  //   }

  //   const newData = { ...this.model };

  //   if (JSON.stringify(originalData) !== JSON.stringify(newData)) {
  //     const auditLog = new AuditLog({
  //       action: action,
  //       model: this.model.constructor.name,
  //       beforeData: originalData,
  //       afterData: newData,
  //       userId: ctx.state.user.id, // assuming user is stored in ctx.state.user
  //       username: ctx.state.user.username, // assuming user is stored in ctx.state.user
  //     });

  //     await auditLog.save();
  //   }
  // }
}
