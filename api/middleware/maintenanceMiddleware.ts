import Koa from 'koa';

import { SETTINGS } from '../settings/settings';

export const maintenanceMiddleware: Koa.Middleware = async (ctx, next) => {
  if (SETTINGS.MAINTENANCE.MODE) {
    ctx.status = SETTINGS.MAINTENANCE.STATUS || 503;
    ctx.body = {
      message:
        SETTINGS.MAINTENANCE.MESSAGE ||
        'Server is currently under maintenance. Please try again later.',
      end_estimate: SETTINGS.MAINTENANCE.END_ESTIMATE
        ? `Estimated end of maintenance: ${SETTINGS.MAINTENANCE.END_ESTIMATE}`
        : undefined,
    };
  } else {
    await next();
  }
};
