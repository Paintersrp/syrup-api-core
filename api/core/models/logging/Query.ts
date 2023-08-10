import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';

export class Query extends Model<InferAttributes<Query>, InferCreationAttributes<Query>> {
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
    verbose: 'Log UUID',
  })
  public logId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(64),
    allowNull: false,
    verbose: 'Query Type',
  })
  public type: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(128),
    allowNull: false,
    verbose: 'ORM Model Name',
  })
  public modelName: CreationOptional<string>;

  @Field({
    type: DataTypes.TEXT,
    allowNull: false,
    verbose: 'SQL',
  })
  public sql: CreationOptional<string>;

  @Field({
    type: DataTypes.FLOAT,
    allowNull: false,
    verbose: 'Duration of Query',
  })
  public duration: CreationOptional<number>;

  @Field({
    type: DataTypes.JSONB,
    allowNull: true,
    verbose: 'SQL Parameters',
  })
  public sqlParameters: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    allowNull: true,
    verbose: 'Query Options',
  })
  public queryOptions: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    allowNull: true,
    verbose: 'Query Metadata',
  })
  public queryMeta: CreationOptional<JSON>;

  static fields?: any;
}

Query.init(
  {
    ...Query.fields,
  },
  {
    indexes: [{ fields: ['logId'] }, { fields: ['type'] }, { fields: ['modelName'] }],
    tableName: 'query_logs',
    sequelize: ORM.database,
  }
);
