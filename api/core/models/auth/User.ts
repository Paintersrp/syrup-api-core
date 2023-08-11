import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { APP_LOGGER, ORM } from '../../../settings';
import { SyModel } from '../SyModel';

import { Profile } from './Profile';
import { faker } from '@faker-js/faker';
import { UserService } from '../../auth/user/UserService';

/**
 * @todo LogChanges Model
 * @todo beforeUpdate / beforeBulkUpdate
 * @todo beforeDestroy (soft)
 *
 * @todo config for salt rounds
 *
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

/**
 * @class User
 *
 * @classdesc The User model represents an individual user within the system, including their authentication details, user role, theme preference, and associated profile.
 *
 * @extends {SyModel<InferAttributes<User, { omit: 'profile' }>, InferCreationAttributes<User, { omit: 'profile' }>>}
 */
export class User extends SyModel<
  InferAttributes<User, { omit: 'profile' }>,
  InferCreationAttributes<User, { omit: 'profile' }>
> {
  @Field({
    type: DataTypes.STRING(40),
    allowNull: false,
    verbose: 'Username',
  })
  public username: string;

  @Field({
    type: DataTypes.STRING(255),
    allowNull: false,
    verbose: 'Password',
  })
  public password: string;

  @Field({
    type: DataTypes.STRING(255),
    verbose: 'Salt',
  })
  public salt?: string;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'Refresh Token',
  })
  public refreshToken?: string;

  @Field({
    type: DataTypes.ENUM(...Object.values(UserRoleEnum)),
    allowNull: false,
    verbose: 'User Role',
    defaultValue: UserRoleEnum.USER,
  })
  public role?: UserRoleEnum;

  @Field({
    type: DataTypes.ENUM(...Object.values(ThemeEnum)),
    allowNull: false,
    verbose: 'User Theme',
    defaultValue: ThemeEnum.DARK,
  })
  public theme?: ThemeEnum;

  public getProfile: HasOneGetAssociationMixin<Profile>;
  public createProfile: HasOneCreateAssociationMixin<Profile>;
  public setProfile: HasOneSetAssociationMixin<Profile, 'userId'>;
  public profile?: NonAttribute<Profile>;

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
   * Hooks to be executed before and after creating user instances.
   */
  public static hooks = {
    beforeCreate: async (instance: User) => {
      const { password, salt } = await UserService.hashPassword(instance.password);
      instance.password = password;
      instance.salt = salt;
    },
    beforeBulkCreate: async (users: User[], options: any) => {
      const promises = users.map(async (user) => {
        const { password, salt } = await UserService.hashPassword(user.password);
        user.password = password;
        user.salt = salt;
      });
      await Promise.all(promises);
    },
    afterCreate: async (user: User, options: any) => {
      user.createBlankProfile();
      SyModel.auditHooks.afterCreate(user, options);
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
    indexes: [{ fields: ['username'] }, { fields: ['role'] }],
    hooks: { ...SyModel.auditHooks, ...User.hooks },
    tableName: 'users',
    sequelize: ORM.database,
  }
);

Profile.belongsTo(User, { targetKey: 'id' });
User.hasOne(Profile, { sourceKey: 'id' });

// User.seedUser(10);
