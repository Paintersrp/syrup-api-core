import Router from 'koa-router';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Logger } from 'pino';
import { InferCreationAttributes } from 'sequelize';

import { SyController } from '../core/controller/SyController';
import { UserSchema } from '../schemas';
import { JWT_SECRET } from '../settings';
import { Blacklist, User } from '../models';

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
   * Checks if the request contains a valid access token.
   */
  private async checkForToken(ctx: Router.RouterContext): Promise<boolean> {
    const accessToken = ctx.cookies.get('jwt');

    if (accessToken) {
      try {
        const decodedToken: any = jwt.verify(accessToken, JWT_SECRET);
        const user = await User.findOne({
          where: { username: decodedToken.username },
        });

        if (user) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    return false;
  }

  /**
   * Generate access token for a user
   */
  private generateAccessToken(user: User) {
    return jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, {
      expiresIn: '480h',
    });
  }

  /**
   * Generate refresh token for a user
   */
  private generateRefreshToken(user: User) {
    return jwt.sign({ username: user.username }, JWT_SECRET);
  }

  /**
   * Set authentication cookies
   */
  private async setCookies(ctx: Router.RouterContext, accessToken: string, refreshToken: string) {
    ctx.cookies.set('jwt', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 48,
    });
    ctx.cookies.set('refreshToken', refreshToken, { httpOnly: true });
  }

  /**
   * Blacklists a token by adding it to the blacklist table.
   */
  private async blacklistToken(token: string) {
    await Blacklist.create({ token });
  }

  /**
   * Checks if a token is blacklisted.
   */
  private async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistEntry = await Blacklist.findOne({ where: { token } });
    return !!blacklistEntry;
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
        ctx.body = 'User registered successfully';
      } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Error registering user', error: error };
      }
    }
  }

  /**
   * Logs in a user and generates access and refresh tokens.
   */
  async login(ctx: Router.RouterContext) {
    console.log(ctx);
    console.log('Test2');
    const { username, password } = ctx.request.body as {
      [key: string]: string;
    };
    const hasToken = await this.checkForToken(ctx);

    if (hasToken) {
      ctx.status = 403;
      ctx.body = { message: 'Already logged in' };
      return;
    }

    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        ctx.throw(401, 'User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        ctx.throw(401, 'Invalid password');
      }

      if (user.refreshToken) {
        const isBlacklisted = await this.isTokenBlacklisted(user.refreshToken);

        if (!isBlacklisted) {
          const decodedOriginalRefresh = jwt.decode(user.refreshToken) as jwt.JwtPayload;
          if (decodedOriginalRefresh) {
            await this.blacklistToken(user.refreshToken);
          }
        }
      }

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      await this.setCookies(ctx, accessToken, refreshToken);

      user.refreshToken = refreshToken;
      await user.save();

      ctx.body = { accessToken, refreshToken };
    } catch (error: any) {
      this.logger.error(error);
      ctx.status = 500;
      ctx.body = { message: 'An error occurred while logging in', error: error.message };
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
        const decodedToken: any = jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findOne({
          where: { username: decodedToken.username },
        });

        if (user && user.refreshToken === refreshToken) {
          const accessToken = this.generateAccessToken(user);
          await this.setCookies(ctx, accessToken, refreshToken);
          await this.blacklistToken(originalAccessToken);
          ctx.body = { accessToken };
        } else {
          ctx.status = 401;
          ctx.body = 'Invalid refresh token';
        }
      } catch (error) {
        ctx.status = 500;
        ctx.body = 'Error refreshing token';
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
      await this.blacklistToken(accessToken);
    }

    if (refreshToken) {
      await this.blacklistToken(refreshToken);
    }

    try {
      ctx.cookies.set('jwt', '', { signed: false, expires: new Date(0) });
      ctx.cookies.set('refreshToken', '', {
        signed: false,
        expires: new Date(0),
      });
      ctx.body = 'Logged out successfully';
    } catch (erorr) {
      ctx.status = 500;
      ctx.body = 'Error logging out';
    }
  }
}
