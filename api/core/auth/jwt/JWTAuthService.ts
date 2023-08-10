import jwt from 'jsonwebtoken';
import { Blacklist, User } from '../../models/auth';
import { RefreshPayload, UserPayload } from './types';
import { RouterContext } from 'koa-router';

/**
 * `JWTAuthService` class provides methods for JWT authentication, including signing, verifying, and managing tokens.
 */
export class JWTAuthService {
  private static readonly SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
  private static readonly DEFAULT_EXPIRES_IN = '1h';

  /**
   * Signs a payload and returns the JWT token.
   * @param payload The user payload to sign.
   * @param expiresIn Optional expiration time.
   * @returns A promise that resolves with the JWT token.
   */
  public static async sign(
    payload: UserPayload,
    expiresIn = this.DEFAULT_EXPIRES_IN
  ): Promise<string> {
    return jwt.sign(payload, this.SECRET, { expiresIn });
  }

  /**
   * Signs a refresh payload and returns the JWT token.
   * @param payload The refresh payload to sign.
   * @param expiresIn Optional expiration time.
   * @returns A promise that resolves with the JWT token.
   */
  public static async signRefresh(
    payload: RefreshPayload,
    expiresIn = this.DEFAULT_EXPIRES_IN
  ): Promise<string> {
    return jwt.sign(payload, this.SECRET, { expiresIn });
  }

  /**
   * Verifies a JWT token.
   * @param token The token to verify.
   * @returns A promise that resolves with the user payload if verification succeeds, otherwise null.
   */
  public static async verify(token: string): Promise<UserPayload | null> {
    if (await this.isBlacklisted(token)) {
      console.error('Token is blacklisted');
      return null;
    }

    try {
      return jwt.verify(token, this.SECRET) as UserPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Decodes a JWT token without verifying it.
   * @param token The token to decode.
   * @returns The decoded user payload, or null if decoding fails.
   */
  public static decode(token: string): UserPayload | null {
    try {
      return jwt.decode(token) as UserPayload;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }

  /**
   * Refreshes a JWT token.
   * @param token The token to refresh.
   * @param expiresIn Optional expiration time.
   * @returns A promise that resolves with the new JWT token if refresh succeeds, otherwise null.
   */
  public static async refresh(
    token: string,
    expiresIn = this.DEFAULT_EXPIRES_IN
  ): Promise<string | null> {
    const decoded = this.decode(token);
    if (decoded) {
      return this.sign(decoded, expiresIn);
    }
    return null;
  }

  /**
   * Adds a token to the blacklist.
   * @param token The token to blacklist.
   */
  public static async addToBlacklist(token: string): Promise<void> {
    await Blacklist.create({ token });
  }

  /**
   * Checks if a token is blacklisted.
   * @param token The token to check.
   * @returns A promise that resolves with true if the token is blacklisted, otherwise false.
   */
  public static async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await Blacklist.findOne({ where: { token } });
    return !!blacklistedToken;
  }

  /**
   * Checks if a token has a specific role.
   * @param token The token to check.
   * @param requiredRole The required role.
   * @returns A promise that resolves with true if the token has the required role, otherwise false.
   */
  public static async hasRole(token: string, requiredRole: string): Promise<boolean> {
    const payload = await this.verify(token);
    return payload?.role === requiredRole;
  }

  /**
   * Checks if the request contains a valid access token.
   */
  public static async checkForToken(ctx: RouterContext): Promise<boolean> {
    const accessToken = ctx.cookies.get('jwt');

    if (accessToken) {
      try {
        const decodedToken: any = jwt.verify(accessToken, this.SECRET);
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
   * Set authentication cookies
   */
  public static async setCookies(ctx: RouterContext, accessToken: string, refreshToken: string) {
    ctx.cookies.set('jwt', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 48,
    });
    ctx.cookies.set('refreshToken', refreshToken, { httpOnly: true });
  }

  /**
   * Set authentication cookies
   */
  public static async clearCookies(ctx: RouterContext) {
    ctx.cookies.set('jwt', '', { signed: false, expires: new Date(0) });
    ctx.cookies.set('refreshToken', '', {
      signed: false,
      expires: new Date(0),
    });
  }
}
