import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';

/**
 * @class Request
 * @classdesc Represents an HTTP request log entry within the system, capturing details of each request and response.
 * @extends {Model<InferAttributes<Request>, InferCreationAttributes<Request>>}
 */
export class Request extends Model<InferAttributes<Request>, InferCreationAttributes<Request>> {
  @Field({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    verbose: 'ID',
  })
  public id: CreationOptional<number>;

  @Field({
    type: DataTypes.DATE,
    verbose: 'Creation Date',
  })
  public createdAt: CreationOptional<Date>;

  @Field({
    type: DataTypes.DATE,
    verbose: 'Last Update Date',
  })
  public updatedAt: CreationOptional<Date>;

  @Field({
    type: DataTypes.STRING(32),
    allowNull: false,
    verbose: 'Event',
  })
  public event: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(32),
    allowNull: false,
    verbose: 'Method',
  })
  public method: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'Path',
  })
  public path: CreationOptional<string>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    verbose: 'Duration',
  })
  public duration: CreationOptional<number>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'User',
  })
  public user: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'Role',
  })
  public role: CreationOptional<string>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    verbose: 'Status',
  })
  public status: CreationOptional<number>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    verbose: 'Response Size',
  })
  public responseSize: CreationOptional<number>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'User Agent',
  })
  public userAgent: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'IP Address',
  })
  public ipAddress: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Request Body',
  })
  public requestBody: CreationOptional<JSON>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'Request ID',
  })
  public requestId: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Query Parameters',
  })
  public queryParameters: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Error',
  })
  public error: CreationOptional<JSON>;

  static fields?: any;
}

Request.init(
  {
    ...Request.fields,
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
