import { DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

import { Field } from '../../lib/decorators/models';
import { ORM } from '../../../settings';
import { SyModel } from '../SyModel';
import { User } from '../../features/user';

/**
 * @class Notification
 *
 * @classdesc Represents a notification that can be sent to a user.
 *
 * @extends {SyModel<InferAttributes<Notification>, InferCreationAttributes<Notification>>}
 */
export class Notification extends SyModel<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  @Field({
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
    verbose: 'User ID',
    comment: 'ID of the user receiving the notification',
  })
  public userId: CreationOptional<number>;

  @Field({
    type: DataTypes.STRING,
    allowNull: false,
    verbose: 'Template ID',
    comment: 'ID of the notification template',
  })
  public templateId: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(1000),
    allowNull: false,
    verbose: 'Notification Subject',
  })
  public subject: CreationOptional<string>;

  @Field({
    type: DataTypes.STRING(5000),
    allowNull: false,
    verbose: 'Notification Message',
  })
  public message: CreationOptional<string>;

  @Field({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    verbose: 'Notification Read Status',
  })
  public read: CreationOptional<boolean>;

  static fields?: any;

  static associate(models: any) {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

Notification.init(
  {
    ...Notification.fields,
  },
  {
    indexes: [{ fields: ['templateId'] }, { fields: ['userId'] }],
    tableName: 'notifications',
    sequelize: ORM.database,
  }
);
