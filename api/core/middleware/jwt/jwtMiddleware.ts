import Koa from 'koa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SETTINGS } from '../../../settings/settings';

// Implement at Config level
// if (!SETTINGS2.AUTH.JWT_SECRET) {
//   throw new Error('Missing JWT_SECRET');
// }

/**
 * Koa middleware to handle JWT authentication. Parses the authorization
 * header, verifies and decodes the JWT token, and attaches the decoded
 * user object to the Koa context state. If authentication fails or is not
 * provided, the middleware simply continues to the next function.
 *
 * @param ctx - Koa context object.
 * @param next - Next middleware function.
 */
export const jwtMiddleware: Koa.Middleware = async (ctx, next) => {
  if (ctx.state.user) {
    return await next();
  }

  const authHeader = ctx.request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return await next();
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return await next();
  }

  try {
    const decodedToken = jwt.verify(token, SETTINGS.AUTH.JWT_SECRET) as JwtPayload;

    if (!decodedToken) {
      return await next();
    }

    if (decodedToken.exp || 0 * 1000 < Date.now()) {
      // Handle token blacklist / refresh
      return await next();
    }

    ctx.state.user = {
      username: decodedToken.username,
      role: decodedToken.role,
    };
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      ctx.throw(401, `JWT verification failed: ${error.message}`);
    } else {
      ctx.logger.error(`JWT verification failed: ${error}`);
    }
  }

  await next();
};
