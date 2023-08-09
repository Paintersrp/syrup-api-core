import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';

export class ErrorLog<
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
    type: DataTypes.STRING(128),
    allowNull: false,
  })
  requestId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: false,
  })
  path: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: false,
  })
  userAgent: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(64),
    allowNull: false,
  })
  ipAddress: CreationOptional<string>;

  @Field({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  error: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    allowNull: true,
  })
  stack: CreationOptional<JSON[]>;

  @Field({
    type: DataTypes.STRING(500),
    allowNull: false,
  })
  userId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(16),
    allowNull: false,
  })
  requestMethod: CreationOptional<string>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  responseStatus: CreationOptional<number>;

  static fields?: any;
}

ErrorLog.init(
  {
    ...ErrorLog.fields,
  },
  {
    indexes: [{ fields: ['requestId'] }, { fields: ['userId'] }, { fields: ['responseStatus'] }],
    tableName: 'error_logs',
    sequelize: ORM.database,
  }
);
