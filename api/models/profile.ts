import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import { faker } from '@faker-js/faker';

import { Field } from '../core/lib/decorators/models';
import { APP_LOGGER, ORM } from '../settings';
import { SyModel } from '../core/model/SyModel';

import { User } from './user';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class Profile extends SyModel<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
  userId: ForeignKey<User['id']>;

  @Field({
    type: DataTypes.STRING(50),
    verbose: 'Email Address',
  })
  email: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'First Name',
  })
  firstName: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(40),
    verbose: 'Last Name',
  })
  lastName: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(1024),
    verbose: 'Biography',
  })
  bio: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(50),
    verbose: 'City',
  })
  city: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Country',
  })
  country: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(20),
    verbose: 'Phone Number',
  })
  phone: CreationOptional<string>;

  // @Field({
  //   type: DataTypes.STRING(255),
  //   verbose: 'Avatar',
  // })
  // avatar: CreationOptional<string>;

  // @Field({
  //   type: DataTypes.ENUM(...Object.values(GenderEnum)),
  //   verbose: 'Gender',
  // })
  // gender: CreationOptional<GenderEnum>;

  // @Field({
  //   type: DataTypes.DATEONLY,
  //   verbose: 'Date of Birth',
  // })
  // dob: CreationOptional<Date>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Facebook',
  })
  facebook: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Instagram',
  })
  instagram: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Threads',
  })
  threads: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Twitter',
  })
  twitter: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'LinkedIn',
  })
  linkedIn: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'Github',
  })
  github: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(30),
    verbose: 'YouTube',
  })
  youtube: CreationOptional<string>;

  toJSON(): any {
    return {
      ...super.toJSON(),
      fullName: `${this.firstName} ${this.lastName}`,
    };
  }

  static async seedProfile(count: number) {
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
    hooks: { ...SyModel.auditHooks },
    tableName: 'profile',
    sequelize: ORM.database,
  }
);

// Profile.seedProfile(10);
