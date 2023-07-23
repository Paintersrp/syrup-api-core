import Router from 'koa-router';
import { Forbidden } from 'http-errors';

export type Role = 'admin' | 'user' | 'guest';

/**
 * A middleware to check if the authenticated user has the required role(s) to access a resource.
 *
 * @param {Role | Role[]} roles - The required role or an array of roles.
 * @returns {Router.IMiddleware} Koa middleware that throws an error if the user does not have the required role(s).
 */
export const rbacMiddleware = (roles: Role | Role[]): Router.IMiddleware => {
  return async (ctx, next) => {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    // Assumes the user object with a 'role' property is attached to ctx.state after authentication
    const userRole = ctx.state.user?.role;

    if (!requiredRoles.includes(userRole)) {
      throw new Forbidden('You do not have the necessary role to perform this action');
    }

    await next();
  };
};
