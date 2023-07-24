import Router from 'koa-router';
import { UserRoleEnum } from '../models/user';
import { ForbiddenError } from '../core/errors/SyError';

/**
 * A middleware to check if the authenticated user has the required role(s) to access a resource.
 *
 * @param {UserRoleEnum | UserRoleEnum[]} roles - The required role or an array of roles.
 * @returns {Router.IMiddleware} Koa middleware that throws an error if the user does not have the required role(s).
 * @throws {ForbiddenError} If the user does not have the required role(s).
 */
export const rbacMiddleware = (roles: UserRoleEnum | UserRoleEnum[]): Router.IMiddleware => {
  return async (ctx, next) => {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const userRole = ctx.state.user?.role || 'user';

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenError('You do not have the necessary role to perform this action');
    }

    try {
      await next();
    } catch (error) {
      throw error;
    }
  };
};
