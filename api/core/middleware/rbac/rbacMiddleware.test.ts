import { UserService } from '../../auth/user';
import { ForbiddenError } from '../../errors/client';
import { UserRoleEnum } from '../../models/auth/User';
import { rbacMiddleware } from './rbacMiddleware';

describe('rbacMiddleware', () => {
  let ctx: any;
  let next: jest.Mock;
  const userRole = UserRoleEnum.USER;

  beforeEach(() => {
    ctx = {
      logger: {
        info: jest.fn(),
      },
      header: { 'user-agent': 'Tom' },
      request: { method: 'GET', url: '/' },
      state: {
        user: {
          role: userRole,
        },
      },
    };
    next = jest.fn();
    UserService.contextRoleResolver = jest.fn().mockResolvedValue(userRole);
  });

  describe('when the user has the required role', () => {
    it('should call the next middleware', async () => {
      const roles = UserRoleEnum.USER;

      await rbacMiddleware(roles)(ctx, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('when the user does not have the required role', () => {
    it('should throw a ForbiddenError', async () => {
      const roles = UserRoleEnum.ADMIN;

      expect.assertions(2);

      try {
        await rbacMiddleware(roles)(ctx, next);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect(next).not.toHaveBeenCalled();
      }
    });
  });

  describe('when the user has one of the required roles', () => {
    it('should call the next middleware', async () => {
      const roles = [UserRoleEnum.USER, UserRoleEnum.ADMIN];

      await rbacMiddleware(roles)(ctx, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
