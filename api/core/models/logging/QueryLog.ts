import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';

export class QueryLog<
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
  logId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(64),
    allowNull: false,
  })
  type: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(128),
    allowNull: false,
  })
  modelName: CreationOptional<string>;

  @Field({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  sql: CreationOptional<string>;

  @Field({
    type: DataTypes.FLOAT,
    allowNull: false,
  })
  duration: CreationOptional<number>;

  @Field({
    type: DataTypes.JSONB,
    allowNull: true,
  })
  sqlParameters: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    allowNull: true,
  })
  queryOptions: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    allowNull: true,
  })
  queryMeta: CreationOptional<JSON>;

  static fields?: any;
}

QueryLog.init(
  {
    ...QueryLog.fields,
  },
  {
    indexes: [{ fields: ['logId'] }, { fields: ['type'] }, { fields: ['modelName'] }],
    tableName: 'query_logs',
    sequelize: ORM.database,
  }
);
