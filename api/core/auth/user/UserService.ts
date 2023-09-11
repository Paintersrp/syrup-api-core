import bcrypt from 'bcrypt';

import { APP_LOGGER } from '../../../settings';
import { IRouterContext } from 'koa-router';
import { User, UserRoleEnum } from '../../features/user/model';
import { UserSession } from '../../../types';

/**
 * `UserService` class provides methods for user management including finding users by
 * various criteria, password hashing and comparison, and session handling.
 */
export class UserService {
  /**
   * Finds a user by their refresh token.
   * @param token The refresh token.
   * @returns The user if found, otherwise null.
   */
  public static async findByToken(token: string) {
    try {
      const user = await User.findOne({ where: { refreshToken: token } });
      return user;
    } catch (error: any) {
      APP_LOGGER.error('Failed to find user by token:', error);
      throw error;
    }
  }

  /**
   * Finds returns user role if user in context session
   * @param ctx The application context.
   * @returns The user role if found, otherwise default value.
   */
  public static contextRoleResolver(ctx: IRouterContext) {
    return ctx.state.user ? ctx.state.user.role : UserRoleEnum.USER;
  }

  /**
   * `generateSessionObject` asynchronously generates a session object that contains essential user information.
   *
   * This function is used to generate a minimal object containing the user's information that can be stored in the session.
   * It does not contain sensitive information such as the user's password or refresh token.
   *
   * @returns {Promise<UserSession>} A promise that resolves with a UserSession object. The UserSession object contains
   * the user's id, username, role, and theme.
   *
   * @example
   * const userSession = await user.generateSessionObject();
   * console.log(userSession);
   * // Output: { id: 1, username: 'JohnDoe', role: 'admin', theme: 'dark' }
   *
   * @public
   */
  public static async generateSessionObject(user: User): Promise<UserSession> {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      theme: user.theme,
    };
  }

  /**
   * Compares the given password with the hash.
   * @param password The password to compare.
   * @param newPassword The hashed password.
   * @returns A promise that resolves to true if the password matches the hash, otherwise false.
   */
  public static async comparePassword(password: string, newPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, newPassword);
  }

  /**
   * Hashes the given password using bcrypt.
   * @param password The password to hash.
   * @returns An object containing the hashed password and salt.
   */
  public static async hashPassword(password: string) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return {
        password: hashedPassword,
        salt,
      };
    } catch (error: any) {
      APP_LOGGER.error('Failed to hash password:', error);
      throw error;
    }
  }

  /**
   * Updates the password for a user by ID.
   * @param userId The ID of the user.
   * @param newPassword The new password to set.
   * @returns A promise that resolves once the password has been updated.
   */
  public static async updatePassword(userId: number, newPassword: string): Promise<void> {
    const { password, salt } = await this.hashPassword(newPassword);
    await User.update({ password: password, salt: salt }, { where: { id: userId } });
  }

  /**
   * Retrieves a user by their unique ID.
   * @param userId The ID of the user to retrieve.
   * @returns A promise that resolves with the User object if found, otherwise null.
   */
  public static async getById(userId: number): Promise<User | null> {
    return User.findByPk(userId);
  }

  /**
   * Retrieves a user by their username.
   * @param username The username of the user to retrieve.
   * @returns A promise that resolves with the User object if found, otherwise null.
   */
  public static async getByUsername(username: string): Promise<User | null> {
    return User.findOne({ where: { username } });
  }

  /**
   * Deletes a user by their unique ID.
   * @param userId The ID of the user to delete.
   * @returns A promise that resolves once the user has been deleted.
   */
  public static async delete(userId: number): Promise<void> {
    await User.destroy({ where: { id: userId } });
  }
}
