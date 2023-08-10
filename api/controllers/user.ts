import Router from 'koa-router';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Logger } from 'pino';
import { InferCreationAttributes } from 'sequelize';

import { SyController } from '../core/controller/SyController';
import { UserSchema } from '../schemas';
import { JWT_SECRET } from '../settings';
import { Blacklist, User } from '../core/models/auth';
import { AuthMessages } from '../core/messages/services';
import { JWTAuthService } from '../core/auth/jwt/JWTAuthService';
import { UserService } from '../core/auth/user/UserService';

export class UserController extends SyController {
  private methodsToBind = ['register', 'login', 'logout', 'refresh_token', 'validateUserBody'];

  /**
   * Creates an instance of the User Controller.
   * @param {Logger} logger The application logger instance.
   */
  constructor(logger: Logger) {
    super({ model: User, schema: UserSchema, logger });

    this.bindMethods(this.methodsToBind);
  }

  /**
   * Middleware to validate the request body against the defined schema.
   * @param {Router.RouterContext} ctx - The Koa router context.
   * @param {() => Promise<any>} next The next middleware function.
   */
  async validateUserBody(ctx: Router.RouterContext, next: () => Promise<any>) {
    const fields = ctx.request.body as InferCreationAttributes<User>;

    if (fields) {
      try {
        await this.validate(fields);
        await next();
      } catch (error) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid request body', error: error };
      }
    }
  }

  /**
   * Registers a new user.
   */
  async register(ctx: Router.RouterContext): Promise<void> {
    const fields = ctx.request.body as InferCreationAttributes<User>;

    if (fields) {
      try {
        await User.create(fields);
        ctx.body = AuthMessages.SUCCESS('User', 'registration');
      } catch (error) {
        ctx.status = 500;
        ctx.body = { message: AuthMessages.FAIL('User', 'registration'), error: error };
      }
    }
  }

  /**
   * Logs in a user and generates access and refresh tokens.
   */
  async login(ctx: Router.RouterContext) {
    const { username, password } = ctx.request.body as {
      [key: string]: string;
    };
    const hasToken = await JWTAuthService.checkForToken(ctx);

    if (hasToken) {
      ctx.status = 403;
      ctx.body = { message: AuthMessages.ALREADY_LOGGED_IN };
      return;
    }

    try {
      const user = await UserService.getByUsername(username);

      if (!user) {
        ctx.throw(401, AuthMessages.USER_NOT_FOUND(username));
      }

      const isValidPassword = await UserService.comparePassword(password, user.password);

      if (!isValidPassword) {
        ctx.throw(401, AuthMessages.INVALID_PASSWORD);
      }

      if (user.refreshToken) {
        const isBlacklisted = await JWTAuthService.isBlacklisted(user.refreshToken);

        if (!isBlacklisted) {
          const decodedOriginalRefresh = JWTAuthService.decode(user.refreshToken);
          if (decodedOriginalRefresh) {
            await JWTAuthService.addToBlacklist(user.refreshToken);
          }
        }
      }

      const userDTO = { id: user.id, username: user.username, role: user.role };
      const accessToken = await JWTAuthService.sign(userDTO);
      const refreshToken = await JWTAuthService.signRefresh({ username: user.username });

      await JWTAuthService.setCookies(ctx, accessToken, refreshToken);

      user.refreshToken = refreshToken;
      await user.save();

      ctx.body = { accessToken, refreshToken };
    } catch (error: any) {
      console.log(error);
      this.logger.error(error);
      ctx.status = 500;
      ctx.body = { message: AuthMessages.FAIL('User', 'login'), error: error.message };
    }
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  async refresh_token(ctx: Router.RouterContext) {
    const { refreshToken } = ctx.request.body as { [key: string]: string };
    const originalAccessToken = ctx.cookies.get('jwt');

    if (originalAccessToken) {
      try {
        const decodedToken = await JWTAuthService.verify(refreshToken);

        if (decodedToken) {
          const user = await UserService.getByUsername(decodedToken.username);

          if (user && user.refreshToken === refreshToken) {
            const accessToken = await JWTAuthService.sign(user);
            await JWTAuthService.setCookies(ctx, accessToken, refreshToken);
            await JWTAuthService.addToBlacklist(originalAccessToken);

            ctx.body = { accessToken };
          } else {
            ctx.status = 401;
            ctx.body = AuthMessages.TOKEN_EXPIRED;
          }
        }
      } catch (error) {
        ctx.status = 500;
        ctx.body = AuthMessages.TOKEN_ERROR;
      }
    }
  }

  /**
   * Logs out the user by blacklisting the access token.
   */
  async logout(ctx: Router.RouterContext) {
    const accessToken = ctx.cookies.get('jwt');
    const refreshToken = ctx.cookies.get('refreshToken');

    if (accessToken) {
      await JWTAuthService.addToBlacklist(accessToken);
    }

    if (refreshToken) {
      await JWTAuthService.addToBlacklist(refreshToken);
    }

    try {
      JWTAuthService.clearCookies(ctx);
      ctx.body = AuthMessages.SUCCESS('User', 'logout');
    } catch (erorr) {
      ctx.status = 500;
      ctx.body = AuthMessages.FAIL('User', 'logout');
    }
  }
}
