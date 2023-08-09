import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';

export class AccessLog<
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
    type: DataTypes.STRING(64),
    allowNull: false,
  })
  event: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(16),
    allowNull: false,
  })
  method: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: false,
  })
  path: CreationOptional<string>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  status: CreationOptional<number>;

  @Field({
    type: DataTypes.STRING(500),
    allowNull: false,
  })
  user: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(64),
    allowNull: false,
  })
  role: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(16),
    allowNull: false,
  })
  access: CreationOptional<'ALLOW' | 'DENY'>;

  @Field({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  reason: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(128),
    allowNull: false,
  })
  requestId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(16),
    allowNull: false,
  })
  action: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: false,
  })
  resource: CreationOptional<string>;

  @Field({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  rule: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: true,
  })
  userAgent: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(64),
    allowNull: false,
  })
  ipAddress: CreationOptional<string>;

  static fields?: any;
}

AccessLog.init(
  {
    ...AccessLog.fields,
  },
  {
    indexes: [
      { fields: ['event'] },
      { fields: ['user'] },
      { fields: ['role'] },
      { fields: ['access'] },
      { fields: ['requestId'] },
    ],
    tableName: 'access_logs',
    sequelize: ORM.database,
  }
);
