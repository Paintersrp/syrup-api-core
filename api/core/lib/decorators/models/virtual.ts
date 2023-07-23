import { DataTypes } from 'sequelize';

/**
 * Decorator to define a virtual column in a Sequelize model.
 */
export function Virtual(target: any, propertyName: string) {
  if (!target.constructor.fields) {
    target.constructor.fields = {};
  }

  target.constructor.fields[propertyName] = { type: DataTypes.VIRTUAL };
}
