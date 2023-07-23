import Router from 'koa-router';
import { DataTypes } from 'sequelize';
import memoize from 'lodash/memoize';

import { ControllerMixinOptions } from '../../types';
import { SyMixin } from '../SyMixin';
import { BadRequestError } from '../../../errors/SyError';

/**
 * Constant of DataTypes to be handled
 */
const DATA_TYPES: Record<string, string> = {
  ENUM: 'ENUM',
  STRING: 'STRING',
  BIGINT: 'BIGINT',
  FLOAT: 'FLOAT',
  DOUBLE: 'DOUBLE',
  REAL: 'REAL',
  DECIMAL: 'DECIMAL',
  INTEGER: 'INTEGER',
  TEXT: 'TEXT',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  ARRAY: 'ARRAY',
  JSON: 'JSON',
  BLOB: 'BLOB',
  UNKNOWN_TYPE: 'UNKNOWN_TYPE',
};

/**
 * Class providing metadata-related functionality.
 * @extends SyMixin
 */
export class SyMetaMixin extends SyMixin {
  /**
   * Constructs a new instance of the SyMetaMixin class.
   * @param {MixinOptions} options - Options for initiating the Mixin class.
   */
  constructor(options: ControllerMixinOptions) {
    super(options);
  }

  /**
   * @method getMetadata
   * @async
   * @description This method is responsible for obtaining metadata of a Sequelize model. The metadata includes
   * attributes (columns) of the model and their types, associations (relations) with other models, and their types.
   * This metadata can be used to dynamically generate UI components, perform validations, or inform other services
   * about the structure of the model.
   *
   * @param {Router.RouterContext} ctx - Koa context. The method sets the ctx.body property with the model's metadata.
   *
   * @returns {Promise<void>} Nothing is explicitly returned but the model's metadata is set to ctx.body.
   *
   * @throws Will throw an error if an issue occurred while trying to fetch the model's attributes or associations.
   */
  async getMetadata(ctx: Router.RouterContext): Promise<void> {
    const attributes = this.model.getAttributes();
    const associations = this.model.associations;

    const structuredAttributes = Object.keys(attributes).map((key) => {
      if (!attributes[key]) {
        throw new BadRequestError(`Failed to fetch attribute for key: ${key}`);
      }
      return {
        name: key,
        type: this.stringifyDataType(attributes[key].type),
        allowNull: attributes[key].allowNull,
      };
    });

    const structuredAssociations = Object.keys(associations).map((key) => {
      if (!associations[key]) {
        throw new BadRequestError(`Failed to fetch association for key: ${key}`);
      }
      return {
        name: key,
        type: associations[key].associationType,
        relatedModel: associations[key].target.name,
      };
    });

    const response = {
      modelName: this.model.name,
      attributes: structuredAttributes,
      associations: structuredAssociations,
    };

    ctx.body = { ...response };
  }

  /**
   * @method stringifyDataType
   * @description This method receives a Sequelize DataType object and returns a string representation of it.
   *
   * @param {any} dataType - Sequelize DataType object.
   *
   * @returns {string} String representation of the Sequelize DataType object.
   *
   * @throws Will throw an error if the dataType parameter is null or undefined.
   */
  private stringifyDataType = memoize((dataType: any): string => {
    switch (dataType.key) {
      case DATA_TYPES.ENUM:
        return `ENUM(${(dataType as DataTypes.EnumDataType<string>).values.join(', ')})`;
      case DATA_TYPES.STRING:
        return dataType.options
          ? `STRING(${(dataType as DataTypes.StringDataType).options?.length})`
          : 'STRING';
      case DATA_TYPES.BIGINT:
      case DATA_TYPES.FLOAT:
      case DATA_TYPES.DOUBLE:
      case DATA_TYPES.REAL:
      case DATA_TYPES.DECIMAL:
      case DATA_TYPES.INTEGER:
      case DATA_TYPES.TEXT:
      case DATA_TYPES.BOOLEAN:
      case DATA_TYPES.DATE:
      case DATA_TYPES.ARRAY:
      case DATA_TYPES.JSON:
      case DATA_TYPES.BLOB:
        return DATA_TYPES[dataType.key];
      default:
        return `${DATA_TYPES.UNKNOWN_TYPE}: ${dataType.key}`;
    }
  });
}
