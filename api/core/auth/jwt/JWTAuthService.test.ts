import jwt from 'jsonwebtoken';
import { JWTAuthService } from './JWTAuthService';
import { mock } from 'jest-mock-extended';
import { RouterContext } from 'koa-router';
import { Blacklist, User } from '../../models/auth';

describe('JWTAuthService', () => {
  const userPayload = { id: 1, username: 'testuser', role: 'user' };
  const refreshTokenPayload = { username: 'testuser' };

  const ctx = mock<RouterContext>();
  const blacklistToken = mock<Blacklist>();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('sign', () => {
    it('should sign a payload and return a JWT token', async () => {
      const token = await JWTAuthService.sign(userPayload);
      expect(jwt.verify(token, JWTAuthService['SECRET'])).toEqual(
        expect.objectContaining(userPayload)
      );
    });
  });

  describe('signRefresh', () => {
    it('should sign a refresh payload and return a JWT token', async () => {
      const token = await JWTAuthService.signRefresh(refreshTokenPayload);
      expect(jwt.verify(token, JWTAuthService['SECRET'])).toEqual(
        expect.objectContaining(refreshTokenPayload)
      );
    });
  });

  describe('verify', () => {
    it('should verify a valid token and return the payload', async () => {
      const token = await JWTAuthService.sign(userPayload);
      const result = await JWTAuthService.verify(token);
      expect(result).toEqual(expect.objectContaining(userPayload));
    });

    it('should return null if the token is invalid', async () => {
      const result = await JWTAuthService.verify('invalid_token');
      expect(result).toBeNull();
    });

    // Add test cases for blacklisted tokens
  });

  describe('decode', () => {
    it('should decode a valid token without verifying it', async () => {
      const token = jwt.sign(userPayload, JWTAuthService['SECRET']);
      const result = JWTAuthService.decode(token);
      expect(result).toEqual(expect.objectContaining(userPayload));
    });

    it('should return null if decoding fails', async () => {
      const result = JWTAuthService.decode('invalid_token');
      expect(result).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should refresh a valid token', async () => {
      const token = await JWTAuthService.sign(userPayload);
      const decoded = JWTAuthService.decode(token);

      if (decoded) {
        delete decoded?.exp; // Remove "exp" property before re-signing
        const newToken = await JWTAuthService.sign(decoded);
        expect(jwt.verify(newToken, JWTAuthService['SECRET'])).toEqual(
          expect.objectContaining(userPayload)
        );
      }
    });

    it('should return null if refreshing an invalid token', async () => {
      const result = await JWTAuthService.refresh('invalid_token');
      expect(result).toBeNull();
    });
  });
  describe('addToBlacklist', () => {
    it('should add a token to the blacklist', async () => {
      Blacklist.create = jest.fn();
      const token = 'blacklist_token';
      await JWTAuthService.addToBlacklist(token);
      expect(Blacklist.create).toHaveBeenCalledWith({ token });
    });
  });

  describe('isBlacklisted', () => {
    it('should return true if the token is blacklisted', async () => {
      Blacklist.findOne = jest.fn().mockResolvedValue(blacklistToken);
      const token = 'blacklist_token';
      const result = await JWTAuthService.isBlacklisted(token);
      expect(result).toBe(true);
    });

    it('should return false if the token is not blacklisted', async () => {
      Blacklist.findOne = jest.fn().mockResolvedValue(null);
      const token = 'valid_token';
      const result = await JWTAuthService.isBlacklisted(token);
      expect(result).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true if the token has the required role', async () => {
      const token = await JWTAuthService.sign(userPayload);
      const result = await JWTAuthService.hasRole(token, 'user');
      expect(result).toBe(true);
    });

    it('should return false if the token does not have the required role', async () => {
      const token = await JWTAuthService.sign(userPayload);
      const result = await JWTAuthService.hasRole(token, 'admin');
      expect(result).toBe(false);
    });
  });

  describe('checkForToken', () => {
    it('should return true if the request contains a valid access token', async () => {
      const token = await JWTAuthService.sign(userPayload);
      ctx.cookies.get = jest.fn().mockReturnValue(token);
      User.findOne = jest.fn().mockResolvedValue(new User());
      const result = await JWTAuthService.checkForToken(ctx);
      expect(result).toBe(true);
    });

    it('should return false if the request does not contain a valid access token', async () => {
      ctx.cookies.get = jest.fn().mockReturnValue('invalid_token');
      const result = await JWTAuthService.checkForToken(ctx);
      expect(result).toBe(false);
    });
  });

  describe('setCookies', () => {
    it('should set authentication cookies', async () => {
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';
      ctx.cookies.set = jest.fn();
      await JWTAuthService.setCookies(ctx, accessToken, refreshToken);
      expect(ctx.cookies.set).toHaveBeenCalledWith('jwt', accessToken, expect.any(Object));
      expect(ctx.cookies.set).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken,
        expect.any(Object)
      );
    });
  });

  describe('clearCookies', () => {
    it('should clear authentication cookies', async () => {
      ctx.cookies.set = jest.fn();
      await JWTAuthService.clearCookies(ctx);
      expect(ctx.cookies.set).toHaveBeenCalledWith('jwt', '', expect.any(Object));
      expect(ctx.cookies.set).toHaveBeenCalledWith('refreshToken', '', expect.any(Object));
    });
  });
});
