import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  DataTypes,
  UpdateOptions,
} from 'sequelize';
import { auditLog } from '../lib/auditLog';
import { AuditAction } from './auditlog';

// async function auditLog(model: any, action: AuditAction) {
//   const dataValues = model.dataValues;
//   const originalData = model._previousDataValues;

//   await AuditLog.create({
//     action,
//     model: model.constructor.name,
//     beforeData: action === AuditAction.DELETE ? originalData : null,
//     afterData: action !== AuditAction.DELETE ? dataValues : null,
//   });
// }

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
   * The version field of the model.
   */
  declare version: CreationOptional<number>;

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
    // version: DataTypes.INTEGER,
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

  // wip, auto auditing hooks... how to merge with in model defined hooks?
  public static auditHooks = {
    afterCreate: async (instance: any, options: any) => {
      await auditLog(instance, options, AuditAction.CREATE);
    },
    afterBulkCreate: async (instances: any[], options: any) => {
      const promises = instances.map(async (instance) => {
        await auditLog(instance, AuditAction.CREATE, options.transaction);
      });
      await Promise.all(promises);
    },
    afterUpdate: async (instance: any, options: any) => {
      await auditLog(instance, options, AuditAction.UPDATE);
    },
    afterBulkUpdate: async (options: any) => {
      // const promises = instances.map(async (instance) => {
      //   await auditLog(instance, AuditAction.UPDATE, options.transaction);
      // });
      // await Promise.all(promises);
    },
    afterDestroy: async (instance: any, options: any) => {
      await auditLog(instance, AuditAction.DELETE, options.transaction);
    },
    afterBulkDestroy: async (options: any) => {
      // const promises = instances.map(async (instance) => {
      //   await auditLog(instance, AuditAction.DELETE, options.transaction);
      // });
      // await Promise.all(promises);
    },
  };
}
