import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';

export class RequestLog<
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
    type: DataTypes.STRING(32),
    allowNull: false,
    verbose: 'Event',
  })
  event: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(32),
    allowNull: false,
    verbose: 'Method',
  })
  method: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'Path',
  })
  path: CreationOptional<string>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    verbose: 'Duration',
  })
  duration: CreationOptional<number>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'User',
  })
  user: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'Role',
  })
  role: CreationOptional<string>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    verbose: 'Status',
  })
  status: CreationOptional<number>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    verbose: 'Response Size',
  })
  responseSize: CreationOptional<number>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'User Agent',
  })
  userAgent: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'IP Address',
  })
  ipAddress: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Request Body',
  })
  requestBody: CreationOptional<JSON>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'Request ID',
  })
  requestId: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Query Parameters',
  })
  queryParameters: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Error',
  })
  error: CreationOptional<JSON>;

  static fields?: any;
}

RequestLog.init(
  {
    ...RequestLog.fields,
  },
  {
    indexes: [
      { fields: ['method'] },
      { fields: ['path'] },
      { fields: ['user'] },
      { fields: ['status'] },
      { fields: ['requestId'] },
    ],
    tableName: 'request_logs',
    sequelize: ORM.database,
  }
);
