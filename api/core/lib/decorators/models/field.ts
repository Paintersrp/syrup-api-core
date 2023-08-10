import { ModelAttributeColumnOptions } from 'sequelize';

type FieldInterface = ModelAttributeColumnOptions & {
  readOnly?: boolean;
  verbose?: string;
};

/**
 * Decorator function used to define Sequelize model properties.
 * @param {FieldInterface} options The field options.
 * @returns The property decorator function.
 */
export function Field({
  type,
  defaultValue = undefined,
  allowNull = true,
  primaryKey = false,
  autoIncrement = false,
  readOnly = false,
  unique = false,
  validate = undefined,
  verbose = undefined,
  references = undefined,
  comment = undefined,
}: FieldInterface): PropertyDecorator {
  return (target: any, propertyKey: string | symbol): void => {
    if (!target.constructor.fields) {
      target.constructor.fields = {};
    }

    target.constructor.fields[propertyKey] = {
      type,
      defaultValue,
      allowNull,
      primaryKey,
      autoIncrement,
      readOnly,
      unique,
      validate,
      references,
      comment,
    };

    if (verbose) {
      if (!target.constructor.metadata) {
        target.constructor.metadata = {};
      }

      target.constructor.metadata[propertyKey] = { verbose: verbose };
    }
  };
}
