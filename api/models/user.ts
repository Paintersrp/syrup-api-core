import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from 'sequelize';
import bcrypt from 'bcrypt';

import { Field } from '../core/lib/decorators/models';
import { APP_LOGGER, ORM } from '../settings';
import { SyModel } from '../core/model/SyModel';

import { Profile } from './profile';
import { faker } from '@faker-js/faker';
import { UserSession } from '../types';

/**
 * @todo Soft Deletion
 * @todo _previousDataValues
 * @todo LogChanges Model
 * @todo beforeUpdate / beforeBulkUpdate
 * @todo beforeDestroy (soft)
 * @todo config for salt rounds
 * @todo "Mixin" Entity Association for various fields like failedLoginAttempts, isAccountLocked, ***active status, accountLockUntil, verificationToken, passwordResetToken, passwordResetTokenExpiry, lastPasswordReset, isTwoFactorEnabled, ***lastLogin, isEmailVerified, lastProfileUpdate
 */

/**
 * Enumeration of user roles.
 */
export enum UserRoleEnum {
  SUPER = 'super',
  ADMIN = 'admin',
  USER = 'user',
}

export const ADMIN_ROLES = ['super', 'admin'];

/**
 * Enumeration of theme options for users.
 */
export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
}

export class User extends SyModel<
  InferAttributes<User, { omit: 'profile' }>,
  InferCreationAttributes<User, { omit: 'profile' }>
> {
  @Field({
    type: DataTypes.STRING(40),
    allowNull: false,
    verbose: 'Username',
  })
  declare username: string;

  @Field({
    type: DataTypes.STRING(255),
    allowNull: false,
    verbose: 'Password',
  })
  declare password: string;

  @Field({
    type: DataTypes.STRING(255),
    verbose: 'Salt',
  })
  declare salt?: string;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'Refresh Token',
  })
  declare refreshToken?: string;

  @Field({
    type: DataTypes.ENUM(...Object.values(UserRoleEnum)),
    allowNull: false,
    verbose: 'User Role',
    defaultValue: UserRoleEnum.USER,
  })
  declare role?: UserRoleEnum;

  @Field({
    type: DataTypes.ENUM(...Object.values(ThemeEnum)),
    allowNull: false,
    verbose: 'User Theme',
    defaultValue: ThemeEnum.DARK,
  })
  declare theme?: ThemeEnum;

  declare getProfile: HasOneGetAssociationMixin<Profile>;
  declare createProfile: HasOneCreateAssociationMixin<Profile>;
  declare setProfile: HasOneSetAssociationMixin<Profile, 'userId'>;
  declare profile?: NonAttribute<Profile>;

  /**
   * Finds a user by their refresh token.
   * @param token The refresh token.
   * @returns The user if found, otherwise null.
   */
  static async findByToken(token: string) {
    try {
      const user = await User.findOne({ where: { refreshToken: token } });
      return user;
    } catch (error: any) {
      APP_LOGGER.error('Failed to find user by token:', error);
      throw error;
    }
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
  public async generateSessionObject(): Promise<UserSession> {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      theme: this.theme,
    };
  }

  /**
   * Creates a blank profile for the user.
   * @param user The user instance.
   */
  public async createBlankProfile() {
    return;
    const fields = Profile.getKeys();
    const emptyProfile: { [key: string]: string } = {};

    for (const field of fields) {
      emptyProfile[field] = '';
    }

    try {
      await this.createProfile(emptyProfile);
    } catch (error: any) {
      console.log(error);
      APP_LOGGER.error('Failed to create blank profile:', error);
    }
  }

  /**
   * Hashes the given password using bcrypt.
   * @param password The password to hash.
   * @returns An object containing the hashed password and salt.
   */
  protected static async hashPassword(password: string) {
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
   * Hooks to be executed before and after creating user instances.
   */
  public static hooks = {
    beforeCreate: async (instance: User) => {
      const { password, salt } = await this.hashPassword(instance.password);
      instance.password = password;
      instance.salt = salt;
    },
    beforeBulkCreate: async (users: User[]) => {
      const promises = users.map(async (user) => {
        const { password, salt } = await User.hashPassword(user.password);
        user.password = password;
        user.salt = salt;
      });
      await Promise.all(promises);
    },
    afterCreate: async (user: User) => {
      user.createBlankProfile();
    },
  };

  /**
   * Seeds the User model with the specified number of dummy user data.
   * @param count The number of users to seed.
   */
  static async seedUser(count: number) {
    try {
      const userData = [];

      for (let i = 0; i < count; i++) {
        const username = faker.internet.userName();
        const password = faker.internet.password();

        userData.push({ username, password });
      }

      await User.bulkCreate(userData);

      APP_LOGGER.info('User seeding completed successfully.');
    } catch (error: any) {
      APP_LOGGER.error('User seeding failed:', error);
    }
  }
}

User.init(
  {
    ...SyModel.metaFields,
    ...User.fields,
  },
  {
    hooks: User.hooks,
    tableName: 'users',
    sequelize: ORM.database,
  }
);

Profile.belongsTo(User, { targetKey: 'id' });
User.hasOne(Profile, { sourceKey: 'id' });

// User.seedUser(10);
