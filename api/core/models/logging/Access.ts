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
 * @class AccessLog
 *
 * @classdesc Represents an access log entry within the system, capturing details of access events.
 *
 * @extends {Model<InferAttributes<AccessLog>, InferCreationAttributes<AccessLog>>}
 */
export class AccessLog extends Model<
  InferAttributes<AccessLog>,
  InferCreationAttributes<AccessLog>
> {
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
    type: DataTypes.STRING(64),
    allowNull: false,
    verbose: 'Event',
  })
  public event: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(16),
    allowNull: false,
    verbose: 'Method',
  })
  public method: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: false,
    verbose: 'URL Path',
  })
  public path: CreationOptional<string>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    verbose: 'Response Status',
  })
  public status: CreationOptional<number>;

  @Field({
    type: DataTypes.STRING(500),
    allowNull: false,
    verbose: 'User',
  })
  public user: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(64),
    allowNull: false,
    verbose: 'User Role',
  })
  public role: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(16),
    allowNull: false,
    verbose: 'Access Status',
  })
  public access: CreationOptional<'ALLOW' | 'DENY'>;

  @Field({
    type: DataTypes.TEXT,
    allowNull: false,
    verbose: 'Access Reason',
  })
  public reason: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(128),
    allowNull: false,
    verbose: 'Request UUID',
  })
  public requestId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(16),
    allowNull: false,
    verbose: 'Action',
  })
  public action: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: false,
    verbose: 'Resource',
  })
  public resource: CreationOptional<string>;

  @Field({
    type: DataTypes.TEXT,
    allowNull: false,
    verbose: 'Rule',
  })
  public rule: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: true,
    verbose: 'Useragent',
  })
  public userAgent: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(64),
    allowNull: false,
    verbose: 'IP Address',
  })
  public ipAddress: CreationOptional<string>;

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
