import Koa from 'koa';
import crypto from 'crypto';

export const nonceMiddleware: Koa.Middleware = async (ctx, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  console.log(nonce, 'nonce');
  console.log(ctx.path, 'nonce');
  ctx.state.cspNonce = nonce;
  await next();
};
