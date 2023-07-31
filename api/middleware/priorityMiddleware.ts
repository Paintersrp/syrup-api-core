import { Context, Next } from 'koa';

// Missing implementation for handling/setting up queue from ctx.state.priority

/**
 * @todo doc
 * @todo array of important endpoints in config
 * @todo priority roles
 */

//doc
export async function priorityMiddleware(ctx: Context, next: Next) {
  function determinePriority(ctx: Context) {
    if (ctx.request.path.startsWith('/important-service')) {
      return 1;
    } else if (ctx.state.user?.role === 'VIP') {
      return 2;
    } else {
      return 3;
    }
  }

  ctx.state.priority = determinePriority(ctx);

  await next();
}
