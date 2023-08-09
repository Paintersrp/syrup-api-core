import { IMiddleware } from 'koa-router';
import { ForbiddenError } from '../core/errors/client';
import { AuthResponses } from '../core/lib/responses';
import { AccessLogObject } from '../core/logging/objects/AccessLogObject';
import { User, UserRoleEnum } from '../models/user';

/**
 * A middleware to check if the authenticated user has the required role(s) to access a resource.
 *
 * @param {UserRoleEnum | UserRoleEnum[]} roles - The required role or an array of roles.
 * @returns {Router.IMiddleware} Koa middleware that throws an error if the user does not have the required role(s).
 * @throws {ForbiddenError} If the user does not have the required role(s).
 */
export const rbacMiddleware = (roles: UserRoleEnum | UserRoleEnum[]): IMiddleware => {
  return async (ctx, next) => {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const userRole = await User.roleResolver(ctx);

    if (!requiredRoles.includes(userRole)) {
      const logObject = new AccessLogObject(ctx, 'DENY', AuthResponses.RBAC_FAIL, 'Middleware');
      logObject.log(ctx);

      throw new ForbiddenError(AuthResponses.RBAC_FAIL);
    }

    const logObject = new AccessLogObject(ctx, 'ALLOW', AuthResponses.RBAC_SUCCESS, 'Middleware');
    logObject.log(ctx);

    await next();
  };
};
