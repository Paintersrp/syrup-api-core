import { FindOptions, Model, ModelStatic, Op } from 'sequelize';
import { Context } from 'koa';

import { BadRequestError } from '../../../errors/client';

import { CustomWhere, FilterOptions, OperatorMapping, QueryType } from './types';
import { SyValidator } from '../../../mixins/validators/SyValidator';
import * as settings from '../../../../settings';
import { server } from '../../../../server';

/**
 * Class for processing query parameters
 */
export class QueryProcessor {
  private model: ModelStatic<Model>;
  private validator: SyValidator;
  private modelAttributes: Set<string>;
  private DEFAULT_PAGE_SIZE = settings.CONTROLLERS.DEFAULT_PAGE_SIZE;
  private MAX_PAGE_SIZE = settings.CONTROLLERS.MAX_PAGE_SIZE;
  private validSortOptions = settings.CONTROLLERS.VALID_SORT_OPTIONS;

  /**
   * Mapping of filter operators to Sequelize operator symbols.
   * These are used to construct the query condition in a Sequelize-compatible format.
   */
  private sequelizeOperators: { [operator: string]: symbol } = {
    greaterThan: Op.gt,
    lessThan: Op.lt,
    in: Op.in,
    notIn: Op.notIn,
    like: Op.like,
    notEqual: Op.ne,
    between: Op.between,
  };

  /**
   * Mapping of filter operators to functions that transform a string value into the desired format for a query condition.
   */
  private operators: OperatorMapping = {
    greaterThan: (value: string) => value,
    lessThan: (value: string) => value,
    in: (value: string) => value.split(','),
    notIn: (value: string) => value.split(','),
    like: (value: string) => `%${value}%`,
    notEqual: (value: string) => value,
    between: (value: string) => value.split(',') as [string, string],
  };

  /**
   * Constructs a new instance of the QueryProcessor class
   * @param {ModelStatic<Model>} model - The model to be used for query processing
   */
  constructor(model: ModelStatic<Model>, validator: SyValidator) {
    this.model = model;
    this.validator = validator;
    this.modelAttributes = new Set(Object.keys(this.model.getAttributes()));
  }

  /**
   * Main method that processes query parameters and returns a FindOptions object
   * @param {Context} ctx - The Koa context
   * @returns {Promise<FindOptions>} Promise object representing the Sequelize find options
   */
  public async processQueryParams(ctx: Context): Promise<FindOptions> {
    const pathContext = ctx.url;
    const query = ctx.request.query as QueryType;
    const findOptions: FindOptions = this.createInitialFindOptions(query);
    this.addFields(findOptions, query.fields);
    this.addSorting(findOptions, pathContext, query);
    this.addFiltering(findOptions, pathContext, query);
    this.addSearch(findOptions, query);
    this.addRangeFilters(findOptions, query);
    this.addIncludes(findOptions, query.includes);

    return findOptions;
  }

  /**
   * Create initial FindOptions with calculated offset and limit
   * @param {QueryType} query - The query parameters
   * @returns {FindOptions} Sequelize find options
   */
  private createInitialFindOptions(query: QueryType): FindOptions {
    return {
      offset: this.calculateOffset(query),
      limit: this.calculateLimit(query.pageSize),
      where: {} as CustomWhere,
    };
  }

  /**
   * Calculate the offset for pagination
   * @param {QueryType} query - The query parameters
   * @returns {number} Calculated offset
   */
  private calculateOffset(query: QueryType): number {
    return ((query.page || 1) - 1) * (query.pageSize || this.DEFAULT_PAGE_SIZE);
  }

  /**
   * Calculate the limit for pagination
   * @param {number} [pageSize] - The page size
   * @returns {number} Calculated limit
   */
  private calculateLimit(pageSize?: number): number {
    return Math.min(pageSize || this.DEFAULT_PAGE_SIZE, this.MAX_PAGE_SIZE);
  }

  /**
   * Add fields to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {string} [fields] - Fields to include
   */
  private addFields(findOptions: FindOptions, fields?: string): void {
    if (fields) {
      findOptions.attributes = fields.split(',');
    }
  }

  /**
   * Add sorting options to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {string} pathContext - The URL path context
   * @param {QueryType} query - The query parameters
   */
  private addSorting(findOptions: FindOptions, pathContext: string, query: QueryType): void {
    if (query.sort && query.sortOrder) {
      if (this.isValidSortOption(query.sortOrder, pathContext)) {
        findOptions.order = [[query.sort, query.sortOrder]];
      }
    }
  }

  /**
   * Add search options to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {QueryType} query - The query parameters
   */
  private addSearch(findOptions: FindOptions, query: QueryType): void {
    if (query.search && query.searchColumns && Array.isArray(query.searchColumns)) {
      (findOptions.where as CustomWhere)[Op.or] = {
        [Op.or]: query.searchColumns.map((column: string) => ({
          [column]: {
            [Op.like]: `%${query.search}%`,
          },
        })),
      };
    }
  }

  /**
   * Add range filters to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {QueryType} query - The query parameters
   */
  private addRangeFilters(findOptions: FindOptions, query: QueryType): void {
    if (query.range && Array.isArray(query.range) && query.rangeColumn) {
      const [rangeStart, rangeEnd] = query.range;
      (findOptions.where as any)[query.rangeColumn] = {
        [Op.gte]: rangeStart,
        [Op.lte]: rangeEnd,
      };
    }
  }

  /**
   * Add filtering options to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {string} pathContext - The URL path context
   * @param {QueryType} query - The query parameters
   */
  private addFiltering(findOptions: FindOptions, pathContext: string, query: QueryType): void {
    if (query.filter && query.column && this.isValidFilterColumn(query.column, pathContext)) {
      if (!findOptions.where) {
        findOptions.where = {};
      }

      (findOptions.where as any)[query.column] = query.filter;
    }

    this.addQueryCondition(findOptions.where as any, query);
  }

  /**
   * Add include options to the FindOptions
   * @param {FindOptions} findOptions - Sequelize find options
   * @param {string[]} [includes] - Array of models to include
   */
  private addIncludes(findOptions: FindOptions, includes?: string[]): void {
    if (includes) {
      findOptions.include = includes.map((modelName) => {
        const model = server.ORM.database.models[modelName];
        if (!model) {
          throw new BadRequestError(`Invalid model name: ${modelName}`);
        }
        return model;
      });
    }
  }

  /**
   * Add query conditions to the CustomWhere object
   * @param {CustomWhere} where - The where clause
   * @param {FilterOptions} query - The query parameters
   */
  private addQueryCondition(where: CustomWhere, query: FilterOptions): void {
    for (const operatorKey in this.operators) {
      const queryValue = query[operatorKey as keyof FilterOptions];
      if (queryValue && typeof queryValue === 'string') {
        const sequelizeOperator = this.sequelizeOperators[operatorKey].toString();
        where[sequelizeOperator] = this.operators[operatorKey as keyof OperatorMapping](queryValue);
      }
    }
  }

  /**
   * Check if filter column is valid
   * @param {string} column - The column to check
   * @param {string} pathContext - The URL path context
   * @returns {boolean} True if valid, false otherwise
   */
  private isValidFilterColumn(column: string, pathContext: string): boolean {
    return (
      this.validator.assertAlphanumeric({
        param: column,
        context: pathContext,
      }) && this.modelHasColumn(column)
    );
  }

  /**
   * Check if the model has the specified column
   * @param {string} column - The column to check
   * @returns {boolean} True if the model has the column, false otherwise
   */
  private modelHasColumn(column: string): boolean {
    return this.modelAttributes.has(column);
  }

  /**
   * Check if sort option is valid
   * @param {string} sort - The sort option to check
   * @param {string} pathContext - The URL path context
   * @returns {boolean} True if valid, false otherwise
   */
  private isValidSortOption(sort: string, pathContext: string): boolean {
    return (
      this.validator.assertAlphanumeric({ param: sort, context: pathContext }) &&
      this.validSortOptions.includes(sort.toLowerCase())
    );
  }
}
