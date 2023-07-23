import Router from 'koa-router';
import validator from 'validator';
import { Logger } from 'pino';
import { ModelStatic, FindOptions, Transaction } from 'sequelize';

import { HttpStatus, Responses } from '../../lib';
import { BadRequestError, NotFoundError } from '../../errors/SyError';
import { ControllerMixinOptions, ControllerQueryOptions } from '../types';
import { BulkIDsBody } from './types';

/**
 * SyMixin is an abstract class designed to be extended by other mixin classes.
 * It provides a set of utility methods that are common to many API endpoints,
 * such as processing of request payload, handling errors, etc.
 *
 * @class SyMixin
 */
export abstract class SyMixin {
  protected model: ModelStatic<any>;
  protected logger: Logger;

  /**
   * Creates an instance of SyMixin.
   * @param {MixinOptions} options - Options to initiate the Mixin class.
   * These options include the Sequelize model and a logger instance.
   */
  constructor(options: ControllerMixinOptions) {
    this.model = options.model;
    this.logger = options.logger;
  }

  /**
   * Constructs the HTTP response for the Koa router.
   * @param {Router.RouterContext} ctx - Koa Router context.
   * @param {HttpStatus} status - HTTP status code.
   * @param {any} body - Response body.
   */
  protected createResponse(ctx: Router.RouterContext, status: HttpStatus, body: any) {
    ctx.status = status;
    ctx.body = body;
  }

  /**
   * Processes the 'id' parameter from the Koa Router context.
   * Throws a BadRequestError if the 'id' is missing in the request.
   * @param {Router.RouterContext} ctx - Koa Router context.
   * @returns {string} The 'id' parameter from the request.
   */
  protected processIdParam(ctx: Router.RouterContext): string {
    const { id } = ctx.params;

    if (!id) {
      throw new BadRequestError(Responses.ID_FAIL, id, ctx.url);
    }

    return id;
  }

  /**
   * Processes the 'ids' parameter from the request body.
   * Throws a BadRequestError if the 'ids' is missing in the request.
   * @param {Router.RouterContext} ctx - Koa Router context.
   * @returns {string[]} The 'ids' parameter from the request.
   */
  protected processIdsParam(ctx: Router.RouterContext): string[] {
    const { ids } = ctx.request.body as BulkIDsBody;

    if (!ids) {
      throw new BadRequestError(Responses.IDS_FAIL, ids, ctx.url);
    }

    return ids;
  }

  /**
   * Processes the payload from the request body.
   * Throws a BadRequestError if the payload is missing in the request or if it's not an array when arrayCheck is true.
   * @param {Router.RouterContext} ctx - Koa Router context.
   * @param {boolean} arrayCheck - A flag indicating whether to check if the payload is an array.
   * @returns {any} The payload from the request.
   */
  protected processPayload(ctx: Router.RouterContext, arrayCheck: boolean = false): any {
    const payload = ctx.request.body;

    if (!payload) {
      throw new BadRequestError(Responses.PAYLOAD_FAIL, payload, ctx.url);
    }

    if (arrayCheck) {
      if (!Array.isArray(payload)) {
        throw new BadRequestError(Responses.ARRAY_FAIL, payload, ctx.url);
      }
    }

    return payload;
  }

  /**
   * Finds an item by its 'id' in the model.
   * Throws a NotFoundError if the item is not found in the database.
   * @param {string} id - The id of the item to be found.
   * @param {Transaction} transaction - The Sequelize transaction.
   * @returns {Promise<any>} A promise that resolves to the found item.
   */
  protected async findItemById(id: string, transaction?: Transaction): Promise<any> {
    const item = await this.model.findByPk(id, { transaction });

    if (!item) {
      throw new NotFoundError(Responses.ID_FAIL, item);
    }

    return item;
  }

  /**
   * Processes request query parameters for pagination, sorting, and filtering.
   * Converts 'page' and 'pageSize' to 'offset' and 'limit' for Sequelize.
   * Also filters and sorts the query if 'column' and 'sort' query params are present.
   * @param {Router.RouterContext} ctx - The Koa Router context.
   * @returns {Promise<FindOptions>} - The Sequelize FindOptions object.
   */
  protected async processQueryParams(ctx: Router.RouterContext): Promise<FindOptions> {
    const query = ctx.request.query as Partial<ControllerQueryOptions>;
    const findOptions: FindOptions = {};

    if (query) {
      const page = query.page || 1;
      const pageSize = query.pageSize || 10;
      findOptions.offset = (page - 1) * pageSize;
      findOptions.limit = pageSize;

      if (query.sort && this.isValidSortOption(query.sort)) {
        findOptions.order = [[query.sort, query.sortOrder || 'ASC']];
      }

      if (query.filter && query.column && this.isValidFilterColumn(query.column)) {
        findOptions.where = { [query.column]: query.filter };
      }
    }

    return findOptions;
  }

  /**
   * Validates whether the filter column exists in the model.
   * Ensures that the column input is alphanumeric and exists in the model.
   * @param {string} column - The column to be validated.
   * @returns {boolean} A boolean indicating whether the column is valid.
   */
  private isValidFilterColumn(column: string): boolean {
    const validColumns = Object.keys(this.model.getAttributes());
    return validator.isAlphanumeric(column) && validColumns.includes(column);
  }

  /**
   * Validates whether the sort option is valid.
   * Ensures that the sort option is alphanumeric and is either 'asc' or 'desc'.
   * @param {string} sort - The sort option to be validated.
   * @returns {boolean} A boolean indicating whether the sort option is valid.
   */
  private isValidSortOption(sort: string): boolean {
    const validSortOptions = ['asc', 'desc'];
    return validator.isAlphanumeric(sort) && validSortOptions.includes(sort.toLowerCase());
  }
}
