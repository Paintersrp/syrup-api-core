import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';
import { SyModel } from '../../models/SyModel';
import { User } from '../user/model';

/**
 * @class Blacklist
 *
 * @classdesc The Blacklist model represents a blacklisted token in the system.
 * It is used to store information about tokens that have been revoked or otherwise invalidated.
 * Each record links a blacklisted token to a specific user.
 *
 * @extends {SyModel<InferAttributes<Blacklist>, InferCreationAttributes<Blacklist>>}
 */
export class Blacklist extends SyModel<
  InferAttributes<Blacklist>,
  InferCreationAttributes<Blacklist>
> {
  public userId: ForeignKey<User['id']>;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'Blacklisted Token',
  })
  public token: CreationOptional<string>;
}

Blacklist.init(
  {
    ...SyModel.metaFields,
    ...Blacklist.fields,
  },
  {
    indexes: [{ fields: ['token'] }],
    tableName: 'blacklist',
    sequelize: ORM.database,
  }
);
