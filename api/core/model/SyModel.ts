import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  DataTypes,
} from 'sequelize';

/**
 * Abstract base class for Sequelize models with additional metadata and field definitions.
 *
 * @template TAttributes - The type of the model attributes.
 * @template TCreationAttributes - The type of the model creation attributes.
 */
export class SyModel<
  TAttributes extends InferAttributes<any>,
  TCreationAttributes extends InferCreationAttributes<any>
> extends Model<TAttributes, TCreationAttributes> {
  /**
   * Optional metadata associated with the model.
   */
  declare static metadata?: NonAttribute<Record<string | symbol, { verbose?: string }>>;

  /**
   * Additional field definitions for the model.
   */
  declare static fields?: any;

  /**
   * The ID field of the model.
   */
  declare id: CreationOptional<number>;

  /**
   * The createdAt field of the model.
   */
  declare createdAt: CreationOptional<Date>;

  /**
   * The updatedAt field of the model.
   */
  declare updatedAt: CreationOptional<Date>;

  /**
   * The metadata fields for the model.
   */
  static metaFields = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  };

  /**
   * Returns an array of field keys.
   *
   * @returns {string[]} An array of field keys.
   */
  public static getKeys(): string[] {
    return Object.keys(this.fields);
  }

  /**
   * Returns an object containing all field definitions.
   *
   * @returns {Record<string, any>} An object containing all field definitions.
   */
  public static getFields(): Record<string, any> {
    return this.fields;
  }
}
