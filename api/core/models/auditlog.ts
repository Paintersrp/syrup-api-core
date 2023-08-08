import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../lib/decorators/models';
import { ORM } from '../../settings';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export class AuditLog<
  TAttributes extends InferAttributes<any>,
  TCreationAttributes extends InferCreationAttributes<any>
> extends Model<TAttributes, TCreationAttributes> {
  @Field({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: CreationOptional<number>;

  @Field({ type: DataTypes.DATE })
  createdAt: CreationOptional<Date>;

  @Field({ type: DataTypes.DATE })
  updatedAt: CreationOptional<Date>;

  @Field({
    type: DataTypes.ENUM(...Object.values(AuditAction)),
    allowNull: false,
    verbose: 'Action',
  })
  action: CreationOptional<AuditAction>;

  @Field({
    type: DataTypes.STRING(64),
    verbose: 'Model',
    allowNull: false,
  })
  model: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Before Data',
  })
  beforeData: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'After Data',
  })
  afterData: CreationOptional<JSON>;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'User ID',
  })
  userId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'Username',
  })
  username: CreationOptional<string>;

  static fields?: any;
}

AuditLog.init(
  {
    ...AuditLog.fields,
  },
  {
    indexes: [{ fields: ['action'] }, { fields: ['username'] }, { fields: ['model'] }],
    tableName: 'audits3',
    sequelize: ORM.database,
  }
);
