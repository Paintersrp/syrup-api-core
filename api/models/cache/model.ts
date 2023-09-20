import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

import { Field, Register } from '../../core/lib';
import { SyModel } from '../../core/models/SyModel';
import { ORM } from '../../settings';

/**
 * @class Cache
 *
 * @classdesc The Cache model represents a cached data within the system.
 * This class allows for efficient retrieval of data that is expensive to compute or fetch.
 *
 * @extends {SyModel<InferAttributes<Cache>, InferCreationAttributes<Cache>>}
 */
@Register
export default class Cache extends SyModel<InferAttributes<Cache>, InferCreationAttributes<Cache>> {
  @Field({
    type: DataTypes.JSON,
    verbose: 'Cache Contents',
  })
  public contents: JSON;
}

Cache.init(
  {
    ...SyModel.metaFields,
    ...Cache.fields,
  },
  {
    hooks: { ...SyModel.auditHooks },
    tableName: 'cache_dump',
    sequelize: ORM.database,
  }
);
