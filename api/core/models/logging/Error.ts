import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';

export class Error extends Model<InferAttributes<Error>, InferCreationAttributes<Error>> {
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
    type: DataTypes.STRING(128),
    allowNull: false,
    verbose: 'Request ID',
  })
  public requestId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: false,
    verbose: 'URL Path',
  })
  public path: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(256),
    allowNull: false,
    verbose: 'Useragent',
  })
  public userAgent: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(64),
    allowNull: false,
    verbose: 'IP Address',
  })
  public ipAddress: CreationOptional<string>;

  @Field({
    type: DataTypes.TEXT,
    allowNull: false,
    verbose: 'Error',
  })
  public error: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    allowNull: true,
    verbose: 'Error Stack',
  })
  public stack: CreationOptional<JSON[]>;

  @Field({
    type: DataTypes.STRING(500),
    allowNull: false,
    verbose: 'User ID',
  })
  public userId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(16),
    allowNull: false,
    verbose: 'Request Method',
  })
  public requestMethod: CreationOptional<string>;

  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    verbose: 'Response Status',
  })
  public responseStatus: CreationOptional<number>;

  static fields?: any;
}

Error.init(
  {
    ...Error.fields,
  },
  {
    indexes: [{ fields: ['requestId'] }, { fields: ['userId'] }, { fields: ['responseStatus'] }],
    tableName: 'error_logs',
    sequelize: ORM.database,
  }
);
