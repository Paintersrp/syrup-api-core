import { Context, Middleware, Next } from 'koa';
import { UserService } from '../../auth/user/UserService';

/**
 * The `sessionMiddleware` function is a Koa middleware that authenticates a user based on a token found in a cookie.
 *
 * If the token is found, the middleware attempts to find a user associated with that token. If the user is found, their
 * essential information is stored in the session and the context's state.
 *
 * If an error occurs during the process, the session and the cookie are cleared.
 *
 * @param {Context} ctx - The Koa context object.
 * @param {Next} next - The next middleware in the Koa middleware stack.
 *
 * @throws Will clear the session and the cookie if an error occurs.
 *
 * @returns {Promise<void>} A promise that resolves when the middleware has completed.
 *
 * @example
 * import Koa from 'koa';
 * import { sessionMiddleware } from './middlewares';
 *
 * const app = new Koa();
 * app.use(sessionMiddleware);
 *
 * @public
 */
export const sessionMiddleware: Middleware = async (ctx: Context, next: Next): Promise<void> => {
  if (ctx.path === '/favicon.ico') return;

  ctx.session!.views = (ctx.session!.views || 0) + 1;
  ctx.session!.actions = ctx.session!.actions || [];
  ctx.session!.actions.push({ action: 'visited', url: ctx.url, timestamp: new Date() });

  const token = ctx.cookies.get('refreshToken');
  // const sid = ctx.cookies.get(config.key) || generateNewSid(); // Define your sid generation logic

  if (!token) {
    await next();
    return;
  }

  try {
    const user = await UserService.findByToken(token);

    if (!user) {
      await next();
      return;
    }

    // ctx.session.lastLoginTime = user.lastLoginTime;
    ctx.session!.devices = ctx.session!.devices || [];
    ctx.session!.devices.push(ctx.request.headers['user-agent']);

    // Check if user session expired.
    // if (user.sessionExpired()) {
    //   ctx.cookies.set('refreshToken', null);
    //   await next();
    //   return;
    // }

    const userObject = await UserService.generateSessionObject(user);

    // // If user's last activity was a long time ago but session has not expired, refresh the token.
    // if (user.shouldRefreshToken()) {
    //   const newToken = await user.refreshToken();
    //   ctx.cookies.set('refreshToken', newToken, { httpOnly: true });
    // }

    if (ctx.session) {
      ctx.session.user = userObject;
    }

    ctx.state.user = userObject;
  } catch (error) {
    ctx.session = null;
    ctx.cookies.set('refreshToken', null);
  }

  await next();
};
