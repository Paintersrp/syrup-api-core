import { FindOptions, Model, ModelStatic, Op } from 'sequelize';
import { Context } from 'koa';
import { RouterContext } from 'koa-router';
import validator from 'validator';

import { BadRequestError, ForbiddenError } from '../../../errors/client';
import { Responses } from '../../../lib';
import { BulkIDsBody } from '../types';
import { AdvancedFilterOptions, ControllerQueryOptions } from './types';
import { ADMIN_ROLES } from '../../../../models/user';
import { UserSession } from '../../../../types';
import { ORM } from '../../../../settings';

/**
 * The `RequestProcessor` class provides methods to process and validate request data for CRUD operations.
 */
export class RequestProcessor {
  private model: ModelStatic<Model>;
  private MAX_PAGE_SIZE = 100; // config
  private validSortOptions = ['asc', 'desc']; // config

  /**
   * Creates an instance of RequestProcessor.
   * @param {ModelStatic<Model>} model - The Sequelize model for which the request is being processed.
   */
  constructor(model: ModelStatic<Model>) {
    this.model = model;
  }

  /**
   * Checks if the current user stored in the context state has the necessary permissions to perform an action.
   *
   * @throws {ForbiddenError} Throws if user does not have the necessary permissions
   */
  public async checkPermission(ctx: RouterContext): Promise<void> {
    if (!this.hasPermission(ctx.state.user)) {
      throw new ForbiddenError(Responses.FORBIDDEN, ctx.state.user);
    }
  }

  /**
   * Checks if the user has an admin role.
   */
  private hasPermission(user: UserSession): boolean {
    return ADMIN_ROLES.includes(user.role!);
  }

  /**
   * Processes the payload from the request body.
   *
   * @param ctx - Koa Router context.
   * @param arrayCheck - A flag indicating whether to check if the payload is an array.
   *
   * @throws {BadRequestError} If the payload is missing in the request or if it's not an array when arrayCheck is true.
   */
  public processPayload(ctx: RouterContext, arrayCheck: boolean = false): any {
    const payload = ctx.request.body;
    this.assertPayloadExists(payload, ctx.url);

    if (arrayCheck) {
      this.assertPayloadIsArray(payload, ctx.url);
    }

    return payload;
  }

  /**
   * Asserts that a payload exists in the request.
   *
   * @throws {BadRequestError} If the payload is missing.
   */
  private assertPayloadExists(payload: any, url: string): void {
    if (!payload) {
      throw new BadRequestError(Responses.PAYLOAD_FAIL, payload, url);
    }
  }

  /**
   * Asserts that the payload is an array.
   *
   * @throws {BadRequestError} If the payload is not an array.
   */
  private assertPayloadIsArray(payload: any, url: string): void {
    if (!Array.isArray(payload)) {
      throw new BadRequestError(Responses.ARRAY_FAIL, payload, url);
    }
  }

  /**
   * Processes the 'id' parameter from the Koa Router context.
   *
   * @throws {BadRequestError} If the 'id' is missing in the request.
   */
  public processIdParam(ctx: RouterContext): string {
    const { id } = ctx.params;
    this.assertIdExists(id, ctx.url);
    return id;
  }

  /**
   * Asserts that the 'id' exists in the request parameters.
   *
   * @throws {BadRequestError} If the 'id' is missing.
   */
  private assertIdExists(id: string, url: string): void {
    if (!id) {
      throw new BadRequestError(Responses.ID_FAIL, id, url);
    }
  }

  /**
   * Processes the 'ids' parameter from the request body.
   *
   * @throws {BadRequestError} If the 'ids' is missing in the request.
   */
  public processIdsParam(ctx: RouterContext): string[] {
    const { ids } = ctx.request.body as BulkIDsBody;
    this.assertIdsExist(ids, ctx.url);
    return ids;
  }

  /**
   * Asserts that the 'ids' exists in the request parameters.
   *
   * @throws {BadRequestError} If the 'ids' are missing.
   */
  private assertIdsExist(ids: string[], url: string): void {
    if (!ids) {
      throw new BadRequestError(Responses.IDS_FAIL, ids, url);
    }
  }

  /**
   * Processes the request's query parameters and constructs a `FindOptions` instance.
   * The constructed `FindOptions` can be directly used with Sequelize's find operations.
   * The following query parameters are supported: page, pageSize, fields, sort, filter, column, search, searchColumns, range, rangeColumn, and includes.
   *
   * @param ctx - The Koa Context object for the request.
   * @returns A Promise that resolves to a `FindOptions` instance.
   */

  /**
   * A method to process query parameters from the request context into a Sequelize find options object.
   * The following query parameters are supported: page, pageSize, fields, sort, filter, column, search, searchColumns, range, rangeColumn, and includes.
   *
   * @param {Context} ctx The request context.
   * @return {Promise<FindOptions>} A promise that resolves with the Sequelize find options object.
   */
  public async processQueryParams(ctx: Context): Promise<FindOptions> {
    const query = ctx.request.query as Partial<ControllerQueryOptions>;
    const findOptions: FindOptions = this.createInitialFindOptions(query);
    this.addFields(findOptions, query.fields);
    this.addSorting(findOptions, query.sort);
    this.addFiltering(findOptions, query);
    this.addSearch(findOptions, query);
    this.addRangeFilters(findOptions, query);
    this.addIncludes(findOptions, query.includes);

    return findOptions;
  }

  /**
   * Creates an initial Sequelize FindOptions object.
   *
   * @returns {FindOptions} - The initial Sequelize FindOptions object.
   */
  private createInitialFindOptions(query: Partial<ControllerQueryOptions>): FindOptions {
    return {
      offset: this.calculateOffset(query),
      limit: this.calculateLimit(query.pageSize),
      where: {},
    };
  }

  /**
   * Calculates the offset for pagination based on the 'page' query parameter.
   *
   * @returns {number} - The calculated offset for pagination.
   */
  private calculateOffset(query: Partial<ControllerQueryOptions>): number {
    return ((query.page || 1) - 1) * (query.pageSize || 10);
  }

  /**
   * Calculates the limit for pagination based on the 'pageSize' query parameter.
   * Ensures that the page size does not exceed the maximum page size.
   *
   * @returns {number} - The calculated limit for pagination.
   */
  private calculateLimit(pageSize?: number): number {
    return Math.min(pageSize || 10, this.MAX_PAGE_SIZE);
  }

  /**
   * Adds fields to the Sequelize FindOptions object based on the 'fields' query parameter.
   */
  private addFields(findOptions: FindOptions, fields?: string): void {
    if (fields) {
      findOptions.attributes = fields.split(',');
    }
  }

  /**
   * Adds sorting to the Sequelize FindOptions object based on the 'sort' query parameter.
   * Validates that the sort option is alphanumeric and is either 'asc' or 'desc'.
   */
  private addSorting(findOptions: FindOptions, sort?: string): void {
    if (sort) {
      const [field, order = 'ASC'] = sort.split('.');
      if (this.isValidSortOption(order)) {
        findOptions.order = [[field, order]];
      }
    }
  }

  /**
   * Modifies the provided `FindOptions` instance by adding a search clause.
   * The clause is constructed based on the `search` and `searchColumns` fields of the `query` parameter.
   * The search clause uses the Sequelize's `Op.like` operator to perform a partial match search on the specified columns.
   */
  private addSearch(findOptions: FindOptions, query: Partial<ControllerQueryOptions>): void {
    if (query.search && query.searchColumns && Array.isArray(query.searchColumns)) {
      (findOptions.where as any)[Op.or] = query.searchColumns.map((column) => ({
        [column]: {
          [Op.like]: `%${query.search}%`,
        },
      }));
    }
  }

  /**
   * Modifies the provided `FindOptions` instance by adding a range filter clause.
   * The clause is constructed based on the `range` and `rangeColumn` fields of the `query` parameter.
   * The range filter clause uses Sequelize's `Op.gte` and `Op.lte` operators to perform a range query on the specified column.
   *
   * @param findOptions - An instance of Sequelize's `FindOptions` to be modified.
   * @param query - A `ControllerQueryOptions` instance containing the range filter criteria. If the `range` field is not provided, or if it's not an array, or if `rangeColumn` is not provided, the method will return without making any changes to `findOptions`.
   */
  private addRangeFilters(findOptions: FindOptions, query: Partial<ControllerQueryOptions>): void {
    if (query.range && Array.isArray(query.range) && query.rangeColumn) {
      (findOptions.where as any)[query.rangeColumn] = {
        [Op.gte]: query.range[0],
        [Op.lte]: query.range[1],
      };
    }
  }

  /**
   * Adds filtering to the Sequelize FindOptions object based on the 'filter' and 'column' query parameters.
   * Validates that the filter column exists in the model.
   */
  private addFiltering(findOptions: FindOptions, query: Partial<ControllerQueryOptions>): void {
    if (query.filter && query.column && this.isValidFilterColumn(query.column)) {
      if (!findOptions.where) {
        findOptions.where = {};
      }

      (findOptions.where as any)[query.column] = query.filter;
    }

    this.addQueryCondition(findOptions.where as any, query);
  }

  /**
   * A method to add includes in the find options.
   *
   * @throws {BadRequestError} When an invalid model name is provided.
   */
  private addIncludes(findOptions: FindOptions, includes?: string[]): void {
    if (includes) {
      findOptions.include = includes.map((modelName) => {
        const model = ORM.database.models[modelName];
        if (!model) {
          throw new BadRequestError(`Invalid model name: ${modelName}`);
        }
        return model;
      });
    }
  }

  /**
   * Adds advanced query conditions to the Sequelize FindOptions object based on the query parameters.
   *
   * @param {any} where - The 'where' property of the Sequelize FindOptions object.
   * @param {AdvancedFilterOptions} query - The advanced filter options.
   */
  private addQueryCondition(where: any, query: AdvancedFilterOptions): void {
    const operators = {
      greaterThan: Op.gt,
      lessThan: Op.lt,
      in: Op.in,
      notIn: Op.notIn,
      like: Op.like,
      notEqual: Op.ne,
      between: Op.between,
    } as const;

    for (const key in operators) {
      const queryKey = key as keyof AdvancedFilterOptions;
      const operatorKey = key as keyof typeof operators;

      if (query[queryKey] && typeof query[queryKey] === 'string') {
        where[key] = {
          [operators[operatorKey]]: this.getConditionValue(key, query[queryKey] as string),
        };
      }
    }
  }

  /**
   * Retrieves the condition value based on the condition key and its associated value.
   * For 'in' condition, splits the value by commas.
   * For 'like' condition, wraps the value with '%'.
   * For other conditions, returns the value as it is.
   *
   * @param {string} key - The condition key.
   * @param {string} value - The associated value.
   * @returns {string | string[]} - The condition value.
   */
  private getConditionValue(key: string, value: string): string | string[] | [string, string] {
    if (key === 'in' || key === 'notIn') {
      return value.split(',');
    } else if (key === 'like') {
      return `%${value}%`;
    } else if (key === 'between') {
      return value.split(',') as [string, string];
    } else {
      return value;
    }
  }

  /**
   * Validates whether the filter column exists in the model.
   * Ensures that the column input is alphanumeric and exists in the model.
   */
  private isValidFilterColumn(column: string): boolean {
    return validator.isAlphanumeric(column) && this.modelHasColumn(column);
  }

  /**
   * Checks if the provided column exists in the model.
   */
  private modelHasColumn(column: string): boolean {
    return Object.keys(this.model.getAttributes()).includes(column);
  }

  /**
   * Ensures that the sort option is alphanumeric and is either 'asc' or 'desc'.
   */
  private isValidSortOption(sort: string): boolean {
    return validator.isAlphanumeric(sort) && this.validSortOptions.includes(sort.toLowerCase());
  }

  // private checkForForbiddenKeys(fields: any) {
  //   for (const key in fields) {
  //     if (SyUpdateMixin.FORBIDDEN_UPDATE_KEYS.includes(key)) {
  //       throw new Error(`Update on forbidden key ${key} is not allowed`);
  //     }
  //   }
  // }
}
