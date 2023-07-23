import Router from 'koa-router';
import { DataTypes } from 'sequelize';
import memoize from 'lodash/memoize';

import { ControllerMixinOptions } from '../../types';
import { SyMixin } from '../SyMixin';
import { BadRequestError } from '../../../errors/SyError';

/**
 * @todo Add extensive error handling for ControllerMixinOptions in the constructor. Validate the options for types, boundaries, and logical consistency.
 * @todo Add functionality to the constructor to allow for options to be changed after instantiation.
 * @todo Implement advanced caching mechanism in getMetadata function, using a least-recently-used (LRU) cache or similar to improve performance on repeated requests. Benchmark the performance before and after implementing caching.
 * @todo Handle edge cases and potential errors when fetching Sequelize model's attributes and associations. Ensure that all possible types of associations are handled correctly.
 * @todo Develop error handling for the stringifyDataType method to ensure it handles all possible data types that Sequelize can generate.
 * @todo For the stringifyDataType method, add functionality to handle any options that may be present for the different data types, like length for STRING.
 * @todo Implement a security review of the code to identify and rectify potential security issues, such as SQL injection or denial-of-service (DoS) vulnerabilities.
 * @todo Implement unit tests for all methods in this class, ensuring high coverage and testing all edge cases. Include performance testing as well.
 * @todo Implement continuous integration (CI) to run these tests on all pull requests.
 * @todo Implement logging for all important events, such as failed data fetching, or high request rates. Consider using a logging service to aggregate and analyze these logs.
 * @todo Review and refactor the code for readability and maintainability, adhering to established best practices and design patterns where necessary.
 * @todo Document all public methods and important private methods in the class. Ensure documentation is comprehensive and clear, and includes examples of usage.
 * @todo Implement accessibility features in any user-facing components that make use of this data, following best practices for accessibility.
 * @todo Implement a feedback mechanism to understand how the data provided by this class is used and whether it meets users' needs.
 */
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
