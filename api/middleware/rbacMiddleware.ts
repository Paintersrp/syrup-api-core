import { IMiddleware, IRouterContext } from 'koa-router';
import { ForbiddenError } from '../core/errors/client';
import { UserRoleEnum } from '../models/user';

type UserRoleResolver = (ctx: IRouterContext) => Promise<UserRoleEnum>;

const userRoleResolver: UserRoleResolver = async (ctx) => {
  return ctx.state.user ? ctx.state.user.role : UserRoleEnum.USER;
};

const RBAC_ERROR_MESSAGE = 'You do not have the necessary role to perform this action';

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
    const userRole = await userRoleResolver(ctx);

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenError(RBAC_ERROR_MESSAGE);
    }

    await next();
  };
};
