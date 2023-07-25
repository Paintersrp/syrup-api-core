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
  // Next, you would use ctx.state.priority to control the order of request handling.
  // This is a simplistic example, in a real-life scenario, you might want to use a
  // priority queue, load balancer, or other more sophisticated methods.

  await next();
}
