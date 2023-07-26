import Router from 'koa-router';
import memoize from 'lodash/memoize';
import { DataTypes } from 'sequelize';

import { BadRequestError } from '../../../errors/client';
import { ControllerMixinOptions } from '../../types';
import { SyMixin } from '../SyMixin';
import { DataTypeOptions } from './enums';

/**
 * @class SyMetaMixin
 * @extends {SyMixin}
 *
 * @description
 * This class is a mixin that provides metadata-related functionality.
 * It adds methods for getting the model's metadata, including its attributes and associations.
 * It also provides methods for structuring these details into a more readable format.
 */
export class SyMetaMixin extends SyMixin {
  /**
   * @constructor
   * @param {ControllerMixinOptions} options - The options for the mixin
   */
  constructor(options: ControllerMixinOptions) {
    super(options);
  }

  /**
   * @method getMetadata
   * @async
   * @description
   * Fetches metadata about the model including its attributes and associations.
   * The result is structured into a more readable format and set on the context body.
   *
   * @param {Router.RouterContext} ctx - The Koa router context
   * @throws {BadRequestError} - When the model, its attributes, or its associations are not defined
   */
  async getMetadata(ctx: Router.RouterContext): Promise<void> {
    const attributes = this.model.getAttributes();
    const associations = this.model.associations;

    // Ensure that the model, its attributes and associations are defined
    if (!this.model || !Object.keys(attributes).length || !Object.keys(associations).length) {
      throw new BadRequestError('The model, its attributes, or associations are not defined');
    }

    // Structure the attributes and associations into a more readable format
    const structuredAttributes = this.getStructuredAttributes(attributes);
    const structuredAssociations = this.getStructuredAssociations(associations);

    const response = {
      modelName: this.model.name,
      attributes: structuredAttributes,
      associations: structuredAssociations,
    };

    ctx.body = { ...response };
  }

  /**
   * @method getStructuredAttributes
   * @private
   * @description
   * Structures the model's attributes into a more readable format.
   *
   * @param {Object} attributes - The model's attributes
   * @returns {Object[]} The structured attributes
   * @throws {BadRequestError} When an attribute is not defined for a given key
   */
  private getStructuredAttributes(attributes: any): any[] {
    return Object.keys(attributes).map((key) => {
      if (!attributes[key]) {
        throw new BadRequestError(`Failed to fetch attribute for key: ${key}`);
      }

      return {
        name: key,
        type: this.stringifyDataType(attributes[key].type),
        allowNull: attributes[key].allowNull,
      };
    });
  }

  /**
   * @method getStructuredAssociations
   * @private
   * @description
   * Structures the model's associations into a more readable format.
   *
   * @param {Object} associations - The model's associations
   * @returns {Object[]} The structured associations
   * @throws {BadRequestError} When an association is not defined for a given key
   */
  private getStructuredAssociations(associations: any): any[] {
    return Object.keys(associations).map((key) => {
      if (!associations[key]) {
        throw new BadRequestError(`Failed to fetch association for key: ${key}`);
      }

      return {
        name: key,
        type: associations[key].associationType,
        relatedModel: associations[key].target.name,
      };
    });
  }

  /**
   * @method stringifyDataType
   * @private
   * @description
   * Converts Sequelize data types into a string format. The result is memoized to improve performance.
   *
   * @param {any} dataType - The Sequelize data type to convert
   * @returns {string} The string format of the data type
   */
  private stringifyDataType = memoize(
    (dataType: any): string => {
      const typeMappings: Record<string, (dataType: any) => string> = {
        [DataTypeOptions.BIGINT]: () => DataTypeOptions.BIGINT,
        [DataTypeOptions.FLOAT]: () => DataTypeOptions.FLOAT,
        [DataTypeOptions.DOUBLE]: () => DataTypeOptions.DOUBLE,
        [DataTypeOptions.REAL]: () => DataTypeOptions.REAL,
        [DataTypeOptions.DECIMAL]: () => DataTypeOptions.DECIMAL,
        [DataTypeOptions.INTEGER]: () => DataTypeOptions.INTEGER,
        [DataTypeOptions.TEXT]: () => DataTypeOptions.TEXT,
        [DataTypeOptions.BOOLEAN]: () => DataTypeOptions.BOOLEAN,
        [DataTypeOptions.DATE]: () => DataTypeOptions.DATE,
        [DataTypeOptions.ARRAY]: () => DataTypeOptions.ARRAY,
        [DataTypeOptions.JSON]: () => DataTypeOptions.JSON,
        [DataTypeOptions.BLOB]: () => DataTypeOptions.BLOB,
        [DataTypeOptions.ENUM]: (dataType) =>
          `ENUM(${(dataType as DataTypes.EnumDataType<string>).values.join(', ')})`,
        [DataTypeOptions.STRING]: (dataType) =>
          dataType.options
            ? `STRING(${(dataType as DataTypes.StringDataType).options?.length})`
            : 'STRING',
      };

      const typeMapping = typeMappings[dataType.key];

      if (typeMapping) {
        return typeMapping(dataType);
      }

      return `${DataTypeOptions.UNKNOWN_TYPE}: ${dataType.key}`;
    },
    // Cache key resolver function for memoization
    () => {
      // Adding a bit of jitter to ensure cache keys are not reused too frequently
      const now = Date.now();
      const jitter = Math.random() * 1000 * 60 * 5;
      return Math.floor((now + jitter) / (1000 * 60 * 60));
    }
  );
}
