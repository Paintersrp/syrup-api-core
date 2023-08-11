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
 * @class Template
 *
 * @classdesc Represents a template that can be used for various purposes such as notifications.
 *
 * @extends {Model<InferAttributes<Template>, InferCreationAttributes<Template>>}
 */
export class Template extends Model<InferAttributes<Template>, InferCreationAttributes<Template>> {
  @Field({
    type: DataTypes.STRING(500),
    primaryKey: true,
    verbose: 'Template ID',
  })
  public id: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(500),
    verbose: 'Template Name',
  })
  public name: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(1000),
    verbose: 'Template Subject',
  })
  public subject: CreationOptional<string>;

  @Field({
    type: DataTypes.TEXT,
    verbose: 'Template Content',
  })
  public content: CreationOptional<string>;

  @Field({
    type: DataTypes.TEXT,
    verbose: 'Template Description',
  })
  public description: CreationOptional<string>;

  static fields?: any;
}

Template.init(
  {
    ...Template.fields,
  },
  {
    indexes: [{ fields: ['id'] }, { fields: ['name'] }],
    tableName: 'templates',
    sequelize: ORM.database,
  }
);
