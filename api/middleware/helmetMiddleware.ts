import Koa from 'koa';
import helmet from 'koa-helmet';
import { Interval } from '../core/lib';

const hstsConfiguration = {
  maxAge: (Interval.Weekly / 1000) * 18,
  includeSubDomains: true,
  preload: true,
};

const frameguardConfiguration = {
  action: 'sameorigin' as const,
};

const hstsMiddleware = helmet.hsts(hstsConfiguration);
const frameguardMiddleware = helmet.frameguard(frameguardConfiguration);
const noSniffMiddleware = helmet.noSniff(true);

export const helmetMiddleware: Koa.Middleware = async (ctx, next) => {
  await hstsMiddleware(ctx, async () => {});
  await frameguardMiddleware(ctx, async () => {});
  await noSniffMiddleware(ctx, async () => {});

  await helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [`'self'`, `'nonce-${ctx.state.cspNonce}'`],
    },
  })(ctx, next);
};
