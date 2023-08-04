import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

import { Field } from '../core/lib/decorators/models';
import { ORM } from '../settings';
import { SyModel } from '../core/model/SyModel';
import { User } from './user';

/**
 * Model for blacklisting invalidated authentication tokens
 */
export class Blacklist extends SyModel<
  InferAttributes<Blacklist>,
  InferCreationAttributes<Blacklist>
> {
  declare userId: ForeignKey<User['id']>;

  @Field({ type: DataTypes.STRING(500), verbose: 'Blacklisted Token' })
  declare token: CreationOptional<string>;
}

Blacklist.init(
  {
    ...SyModel.metaFields,
    ...Blacklist.fields,
  },
  {
    hooks: { ...SyModel.auditHooks },
    tableName: 'blacklist',
    sequelize: ORM.database,
  }
);
