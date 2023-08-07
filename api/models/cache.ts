import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

import { Field } from '../core/lib/decorators/models';

import { SyModel } from '../core/model/SyModel';
import { ORM } from '../settings';

/**
 * Model for saving the in-memory cache to storage on graceful shutdowns for reloading
 */
export class Cache extends SyModel<InferAttributes<Cache>, InferCreationAttributes<Cache>> {
  @Field({
    type: DataTypes.JSON,
    verbose: 'Cache Contents',
  })
  contents: JSON;
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
