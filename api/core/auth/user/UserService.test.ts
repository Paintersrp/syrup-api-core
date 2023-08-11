import { UserService } from './UserService';
import { User } from '../../models/auth';
import { ThemeEnum, UserRoleEnum } from '../../models/auth/User';
import bcrypt from 'bcrypt';
import { IRouterContext } from 'koa-router';
import { mock } from 'jest-mock-extended';

jest.mock('../../models/auth');
jest.mock('bcrypt');

const extendedUserMock = mock<User>();
extendedUserMock.id = 1;
extendedUserMock.username = 'JohnDoe';
extendedUserMock.role = UserRoleEnum.USER;
extendedUserMock.theme = ThemeEnum.DARK;
extendedUserMock.password = 'hashedPassword';
extendedUserMock.salt = 'salt';

describe('UserService', () => {
  describe('findByToken', () => {
    let findOneSpy: jest.SpyInstance;

    beforeEach(() => {
      findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(extendedUserMock);
    });

    afterEach(() => {
      findOneSpy.mockRestore();
    });

    it('should find a user by token', async () => {
      const user = await UserService.findByToken('token');
      expect(user).toEqual(extendedUserMock);
    });

    it('should throw an error if something goes wrong', async () => {
      findOneSpy.mockRejectedValue(new Error('Database error'));

      await expect(UserService.findByToken('token')).rejects.toThrow('Database error');
    });
  });

  describe('contextRoleResolver', () => {
    it('should return user role if user in context session', () => {
      const ctx = { state: { user: { role: UserRoleEnum.ADMIN } } } as IRouterContext;

      const role = UserService.contextRoleResolver(ctx);
      expect(role).toEqual(UserRoleEnum.ADMIN);
    });

    it('should return default user role if no user in context session', () => {
      const ctx = { state: {} } as IRouterContext;

      const role = UserService.contextRoleResolver(ctx);
      expect(role).toEqual(UserRoleEnum.USER);
    });
  });

  describe('generateSessionObject', () => {
    it('should generate a user session object', async () => {
      const session = await UserService.generateSessionObject(extendedUserMock);
      expect(session).toEqual({
        id: extendedUserMock.id,
        username: extendedUserMock.username,
        role: extendedUserMock.role,
        theme: extendedUserMock.theme,
      });
    });
  });

  describe('comparePassword', () => {
    it('should compare password with hash and return true if match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await UserService.comparePassword('password', 'hashedPassword');
      expect(result).toBe(true);
    });

    it('should compare password with hash and return false if not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await UserService.comparePassword('password', 'wrongHashedPassword');
      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('should hash a given password', async () => {
      const salt = 'salt';
      const hashedPassword = 'hashedPassword';

      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve(salt as any));
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword as any));

      const result = await UserService.hashPassword('password');

      expect(result).toEqual({ password: hashedPassword, salt: salt });
    });

    it('should throw an error if hashing fails', async () => {
      const errorMessage = 'Hashing failed';

      jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => Promise.reject(new Error(errorMessage) as any));

      await expect(UserService.hashPassword('password')).rejects.toThrow(errorMessage);
    });
  });

  describe('updatePassword', () => {
    it('should update the password for a user by ID', async () => {
      UserService.hashPassword = jest.fn().mockResolvedValue({
        password: 'newHashedPassword',
        salt: 'newSalt',
      });
      await UserService.updatePassword(extendedUserMock.id, 'newPassword');
      expect(User.update).toHaveBeenCalledWith(
        { password: 'newHashedPassword', salt: 'newSalt' },
        { where: { id: extendedUserMock.id } }
      );
    });
  });

  describe('getById', () => {
    it('should retrieve a user by their unique ID', async () => {
      User.findByPk = jest.fn().mockResolvedValue(extendedUserMock);

      const user = await UserService.getById(extendedUserMock.id);
      expect(user).toEqual(extendedUserMock);
    });
  });

  describe('getByUsername', () => {
    it('should retrieve a user by their username', async () => {
      User.findOne = jest.fn().mockResolvedValue(extendedUserMock);

      const user = await UserService.getByUsername(extendedUserMock.username);
      expect(user).toEqual(extendedUserMock);
    });
  });

  describe('delete', () => {
    it('should delete a user by their unique ID', async () => {
      User.destroy = jest.fn().mockResolvedValue(extendedUserMock);

      await UserService.delete(extendedUserMock.id);
      expect(User.destroy).toHaveBeenCalledWith({ where: { id: extendedUserMock.id } });
    });
  });
});
