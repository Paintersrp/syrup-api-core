import Koa from 'koa';

import * as settings from '../settings';

export const maintenanceMiddleware: Koa.Middleware = async (ctx, next) => {
  if (settings.MAINTENANCE_MODE) {
    ctx.status = settings.MAINTENANCE_STATUS || 503;
    ctx.body = {
      message:
        settings.MAINTENANCE_MESSAGE ||
        'Server is currently under maintenance. Please try again later.',
      end_estimate: settings.MAINTENANCE_END_ESTIMATE
        ? `Estimated end of maintenance: ${settings.MAINTENANCE_END_ESTIMATE}`
        : undefined,
    };
  } else {
    await next();
  }
};
