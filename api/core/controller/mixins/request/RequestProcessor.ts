import { RouterContext } from 'koa-router';

import * as settings from '../../../../settings';
import { ForbiddenError } from '../../../errors/client';
import { Responses } from '../../../lib';
import { UserSession } from '../../../../types';
import { ValidationResponses } from '../../../lib/responses';
import { SyValidator } from '../../../validators/SyValidator';
import { Logger } from 'pino';

/**
 * @class
 * @classdesc A utility class to handle request processing, validation and user permissions check for CRUD operations.
 */
export class RequestProcessor {
  protected logger: Logger;
  protected validator: SyValidator;

  /**
   * @constructor
   */
  constructor(logger: Logger, validator: SyValidator) {
    this.logger = logger;
    this.validator = validator;
  }

  /**
   * @public
   * @description Checks if the current user stored in the context state has the necessary permissions to perform an action.
   * @param {RouterContext} ctx - Koa Router context.
   * @throws {ForbiddenError} Throws an error if user does not have the necessary permissions.
   * @returns {void}
   */
  public checkPermission(ctx: RouterContext): void {
    if (!this.hasPermission(ctx.state.user)) {
      throw new ForbiddenError(Responses.FORBIDDEN, ctx.state.user);
    }
  }

  /**
   * @private
   * @description Checks if the user has an admin role.
   * @param {UserSession} user - User session object
   * @returns {boolean} Returns true if the user has an admin role, false otherwise.
   */
  private hasPermission(user: UserSession): boolean {
    return settings.ADMIN_ROLES.includes(user.role!);
  }

  /**
   * @public
   * @description Processes a named header from the request.
   * @param {RouterContext} ctx - Koa Router context.
   * @param {string} headerName - The name of the header to process.
   * @throws {BadRequestError} If the header is missing in the request.
   * @returns {string | string[] | undefined} The value of the header.
   */
  public processHeader(ctx: RouterContext, headerName: string): string | string[] | undefined {
    const headerValue = ctx.request.headers[headerName];
    this.validator.assertExists({
      param: headerValue,
      context: ctx.url,
      errorMessage: ValidationResponses.HEADER_FAIL(headerName),
    });
    return headerValue;
  }

  /**
   * @public
   * @description Processes the payload from the request body and checks for forbidden keys.
   * @param {RouterContext} ctx - Koa Router context.
   * @param {boolean} arrayCheck - A flag indicating whether to check if the payload is an array.
   * @throws {BadRequestError} If the payload is missing in the request, if it's not an array when arrayCheck is true, or if it contains forbidden keys.
   * @returns {any} The payload from the request body.
   */
  public processPayload(ctx: RouterContext, arrayCheck: boolean = false): any {
    const payload = ctx.request.body;
    this.validator.assertExists({
      param: payload,
      context: ctx.url,
      errorMessage: Responses.PAYLOAD_FAIL,
    });

    if (arrayCheck) {
      this.validator.assertArray({ param: payload, context: ctx.url });
    }

    return payload;
  }

  /**
   * @public
   * @description Processes a named parameter from the request context.
   * @param {RouterContext} ctx - Koa Router context.
   * @param {string} paramName - The name of the parameter to process.
   * @throws {BadRequestError} If the parameter is missing in the request.
   * @returns {string} The value of the parameter.
   */
  public processParam(ctx: RouterContext, paramName: string): string {
    const paramValue = ctx.params[paramName];

    this.validator.assertExists({
      param: paramValue,
      context: ctx.url,
      errorMessage: ValidationResponses.PARAM_FAIL(paramName),
    });

    return paramValue;
  }

  /**
   * @public
   * @description Processes a named parameter from the request body.
   * @param {RouterContext} ctx - Koa Router context.
   * @param {string} paramName - The name of the parameter to process.
   * @throws {BadRequestError} If the parameter is missing in the request.
   * @returns {any} The value of the parameter.
   */
  public processBodyParam(ctx: RouterContext, paramName: string): any {
    const body = ctx.request.body as Record<string, any>;
    const paramValue = body[paramName];

    this.validator.assertExists({
      param: paramValue,
      context: ctx.url,
      errorMessage: ValidationResponses.PARAM_FAIL(paramName),
    });

    return paramValue;
  }

  // /**
  //  * @private
  //  * @description Checks a payload for forbidden keys and throws an error if any are found.
  //  * @param {any} fields - The payload to check.
  //  * @throws {BadRequestError} If the payload contains forbidden keys.
  //  * @returns {void}
  //  */
  // private checkForForbiddenKeys(fields: any): void {
  //   const FORBIDDEN_UPDATE_KEYS = ['key1', 'key2']; // replace with your actual forbidden keys
  //   for (const key in fields) {
  //     if (FORBIDDEN_UPDATE_KEYS.includes(key)) {
  //       throw new BadRequestError(
  //         `Update on forbidden key ${key} is not allowed`,
  //         fields,
  //         'payload'
  //       );
  //     }
  //   }
  // }
}
