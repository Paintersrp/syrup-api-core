import { Context, Next } from 'koa';

/**
 * Role is a decorator that checks if the user making the request has one of the specified roles.
 * It throws an error if the user does not have a valid role.
 *
 * @param {string[]} roles - The array of valid roles.
 *
 * @example
 * *@Role(['admin', 'moderator'])
 * async someFunction(ctx: Context, next: Next) {}
 */
export function Role(roles: string[]) {
  return function (_: Object, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context, next: Next) {
      const user = ctx.state.user;

      if (!user || !roles.includes(user.role)) {
        throw new Error('Forbidden');
      }

      await originalMethod.call(this, ctx, next);
    };
  };
}
