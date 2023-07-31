import Koa from 'koa';

/**
 * Remove trailing slash from a string (if present)
 *
 * @param {string} str - The string from which to remove the trailing slash *
 * @return {string} - The string without a trailing slash
 */
export const removeTrailingSlash = (str: string): string => {
  if (str.slice(-1) === '/' && str.length > 1) {
    return str.slice(0, -1);
  }
  return str;
};

/**
 * @function normalizeMiddleware
 * Middleware to normalize paths by removing trailing slashes
 *
 * @param {Koa.Context} ctx - The Koa context object
 * @param {Koa.Next} next - The Koa next function to continue the middleware chain
 */
export const normalizeMiddleware: Koa.Middleware = async (ctx, next) => {
  const normalizedPath = removeTrailingSlash(ctx.path);

  if (ctx.path !== normalizedPath) {
    ctx.redirect(normalizedPath);
  } else {
    await next();
  }
};
