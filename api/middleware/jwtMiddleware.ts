import Koa from 'koa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../settings';

/**
 * Koa middleware to handle JWT authentication. Parses the authorization
 * header, verifies and decodes the JWT token, and attaches the decoded
 * user object to the Koa context state.
 *
 * @param ctx - Koa context object.
 * @param next - Next middleware function.
 */
export const jwtMiddleware: Koa.Middleware = async (ctx, next) => {
  const authHeader = ctx.request.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!token) {
      ctx.status = 401;
      ctx.body = { error: 'Missing token' };
    }

    try {
      if (token) {
        const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;

        ctx.state.user = decodedToken.username;
        ctx.state.role = decodedToken.role;
        ctx.state.token = decodedToken;
      }
    } catch (error) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token', errors: error };
    }
  }

  await next();
};
