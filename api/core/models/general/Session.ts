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
 * @class Session
 *
 * @classdesc Represents a user session within the system.
 *
 * @extends {Model<InferAttributes<Session>, InferCreationAttributes<Session>>}
 */
export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
  @Field({
    type: DataTypes.STRING,
    primaryKey: true,
    verbose: 'Session ID',
  })
  public sid: CreationOptional<string>;

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
    type: DataTypes.DATE,
    verbose: 'Session Expiration Date',
  })
  public expiresAt: CreationOptional<Date>;

  @Field({
    type: DataTypes.STRING(5000),
    verbose: 'Session Data',
  })
  public data: CreationOptional<string>;

  static fields?: any;
}

Session.init(
  {
    ...Session.fields,
  },
  {
    indexes: [{ fields: ['sid'] }],
    tableName: 'sessions3',
    sequelize: ORM.database,
  }
);
