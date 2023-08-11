import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import { faker } from '@faker-js/faker';

import { Field } from '../../lib/decorators/models';
import { APP_LOGGER, ORM } from '../../../settings';
import { SyModel } from '../SyModel';

import { User } from './User';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

/**
 * @class Profile
 *
 * @classdesc The Profile model represents the user's personal profile, including contact information, social media accounts, and personal details.
 *
 * @extends {SyModel<InferAttributes<Profile>, InferCreationAttributes<Profile>>}
 */
export class Profile extends SyModel<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
  public userId: ForeignKey<User['id']>;

  @Field({
    type: DataTypes.STRING(50),
    verbose: 'Email Address',
  })
  public email: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'First Name',
  })
  public firstName: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(40),
    verbose: 'Last Name',
  })
  public lastName: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(1024),
    verbose: 'Biography',
  })
  public bio: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(50),
    verbose: 'City',
  })
  public city: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Country',
  })
  public country: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(20),
    verbose: 'Phone Number',
  })
  public phone: CreationOptional<string>;

  // @Field({
  //   type: DataTypes.STRING(255),
  //   verbose: 'Avatar',
  // })
  // public avatar: CreationOptional<string>;

  // @Field({
  //   type: DataTypes.ENUM(...Object.values(GenderEnum)),
  //   verbose: 'Gender',
  // })
  // public gender: CreationOptional<GenderEnum>;

  // @Field({
  //   type: DataTypes.DATEONLY,
  //   verbose: 'Date of Birth',
  // })
  // public dob: CreationOptional<Date>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Facebook',
  })
  public facebook: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Instagram',
  })
  public instagram: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Threads',
  })
  public threads: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Twitter',
  })
  public twitter: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'LinkedIn',
  })
  public linkedIn: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Github',
  })
  public github: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'YouTube',
  })
  public youtube: CreationOptional<string>;

  public toJSON(): any {
    return {
      ...super.toJSON(),
      fullName: `${this.firstName} ${this.lastName}`,
    };
  }

  public static async seedProfile(count: number) {
    try {
      const profileData = [];

      for (let i = 0; i < count; i++) {
        profileData.push({
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          bio: faker.lorem.sentence(),
          city: faker.location.city(),
          country: faker.location.country(),
          phone: faker.phone.number(),
          facebook: faker.internet.userName(),
          instagram: faker.internet.userName(),
          threads: faker.internet.userName(),
          twitter: faker.internet.userName(),
          linkedIn: faker.internet.userName(),
          github: faker.internet.userName(),
          youtube: faker.internet.userName(),
        });
      }

      await Profile.bulkCreate(profileData);

      APP_LOGGER.info('Profile seeding completed successfully.');
    } catch (error: any) {
      APP_LOGGER.error('Profile seeding failed:', error);
    }
  }
}

Profile.init(
  {
    ...SyModel.metaFields,
    ...Profile.fields,
  },
  {
    indexes: [{ fields: ['userId'] }],
    hooks: { ...SyModel.auditHooks },
    tableName: 'profile',
    sequelize: ORM.database,
  }
);

// Profile.seedProfile(10);
