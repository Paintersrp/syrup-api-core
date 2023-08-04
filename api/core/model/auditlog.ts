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
  declare id: CreationOptional<number>;

  @Field({ type: DataTypes.DATE })
  declare createdAt: CreationOptional<Date>;

  @Field({ type: DataTypes.DATE })
  declare updatedAt: CreationOptional<Date>;

  @Field({
    type: DataTypes.ENUM(...Object.values(AuditAction)),
    allowNull: false,
    verbose: 'Action',
  })
  declare action: CreationOptional<AuditAction>;

  @Field({
    type: DataTypes.STRING(64),
    verbose: 'Model',
    allowNull: false,
  })
  declare model: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Before Data',
  })
  declare beforeData: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'After Data',
  })
  declare afterData: CreationOptional<JSON>;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'User ID',
  })
  declare userId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'Username',
  })
  declare username: CreationOptional<string>;

  /**
   * Additional field definitions for the model.
   */
  declare static fields?: any;
}

AuditLog.init(
  {
    ...AuditLog.fields,
  },
  {
    tableName: 'audits3',
    sequelize: ORM.database,
  }
);
