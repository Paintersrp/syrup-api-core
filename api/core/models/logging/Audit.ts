import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export class Audit extends Model<InferAttributes<Audit>, InferCreationAttributes<Audit>> {
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
    type: DataTypes.ENUM(...Object.values(AuditAction)),
    allowNull: false,
    verbose: 'Action',
  })
  public action: CreationOptional<AuditAction>;

  @Field({
    type: DataTypes.STRING(64),
    verbose: 'Model',
    allowNull: false,
  })
  public model: CreationOptional<string>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'Before Data',
  })
  public beforeData: CreationOptional<JSON>;

  @Field({
    type: DataTypes.JSONB,
    verbose: 'After Data',
  })
  public afterData: CreationOptional<JSON>;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'User ID',
  })
  public userId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'Username',
  })
  public username: CreationOptional<string>;

  static fields?: any;
}

Audit.init(
  {
    ...Audit.fields,
  },
  {
    indexes: [{ fields: ['action'] }, { fields: ['username'] }, { fields: ['model'] }],
    tableName: 'audits3',
    sequelize: ORM.database,
  }
);
