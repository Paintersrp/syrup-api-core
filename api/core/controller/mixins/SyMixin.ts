import { RouterContext } from 'koa-router';
import { Logger } from 'pino';
import { ModelStatic, FindOptions, Transaction, Model } from 'sequelize';

import { HttpStatus } from '../../lib';
import { NotFoundError } from '../../errors/client';
import { ControllerMixinOptions } from '../types';
import { RequestProcessor } from './request/RequestProcessor';
import { QueryProcessor } from './queries/QueryProcessor';
import { ValidationResponses } from '../../lib/responses';
import { FieldDTO } from './types';
import { SyValidator } from '../../validators/SyValidator';

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
  protected validator: SyValidator;
  protected requestProcessor: RequestProcessor;
  protected queryProcessor: QueryProcessor;

  /**
   * Creates an instance of SyMixin.
   *
   * @param {MixinOptions} options - Options to initiate the Mixin class.
   */
  constructor(options: ControllerMixinOptions) {
    this.model = options.model;
    this.logger = options.logger;

    this.validator = new SyValidator();
    this.requestProcessor = new RequestProcessor(this.logger, this.validator);
    this.queryProcessor = new QueryProcessor(this.model, this.validator);
  }

  /**
   * Constructs the HTTP response for the Koa router.
   *
   * @param {RouterContext} ctx - Koa Router context.
   * @param {HttpStatus} status - HTTP status code.
   * @param {unknown} body - Response body.
   * @param {string} message - Response message.
   * @param {string} error - Response error code.
   */
  protected createResponse(
    ctx: RouterContext,
    status: HttpStatus,
    body: unknown,
    message?: string,
    error?: string
  ) {
    ctx.status = status;
    ctx.body = this.formatResponseBody(status, body, message, error);
  }

  /**
   * Formats the body of the HTTP response for the Koa router.
   *
   * @param {HttpStatus} status - HTTP status code.
   * @param {unknown} body - Response body.
   * @param {string} message - Response message.
   * @param {string} error - Response error code.
   * @returns {Object} The formatted response body.
   */
  private formatResponseBody(
    status: HttpStatus,
    body: unknown,
    message?: string,
    error?: string
  ): Object {
    return {
      status: status >= 200 && status < 300 ? 'success' : 'error',
      message,
      data: body,
      errorCode: error || undefined,
    };
  }

  /**
   * Finds an item by its 'id' in the model.
   * Throws a NotFoundError if the item is not found in the database.
   *
   * @param {string} id - The id of the item to be found.
   * @param {Transaction} transaction - The Sequelize transaction.
   * @returns {Promise<Model>} A promise that resolves to the found item.
   */
  protected async findItemById(id: string, transaction?: Transaction): Promise<Model> {
    const item = await this.model.findByPk(id, { transaction });
    this.assertItemExists(item, ValidationResponses.ID_FAIL);
    return item;
  }

  /**
   * Asserts an item exists
   *
   * @throws {NotFoundError} If the item is not found.
   */
  private assertItemExists(item: Model, failMsg: string = ValidationResponses.ITEM_FAIL): void {
    if (!item) {
      throw new NotFoundError(failMsg, item);
    }
  }

  /**
   * Finds an item based on a field and field value.
   *
   * @param {string} field - The field to search.
   * @param {string | number} value - The value in the field to search for.
   * @param {Transaction} transaction - The Sequelize transaction.
   * @returns {Promise<Model>} A promise that resolves to the found item.
   */
  protected async findItem(
    field: string,
    value: string | number,
    transaction?: Transaction
  ): Promise<Model> {
    const item = await this.model.findOne({ where: { [field]: value }, transaction });
    this.assertItemExists(item, ValidationResponses.ID_FAIL);
    return item;
  }

  /**
   * Returns the model name based on an object returned from an ORM action
   *
   * @param {Model} item - The id of the item to be found.
   * @returns {string} A promise that resolves to the found item.
   */
  protected getModelName(item: Model): string {
    const modelName = item.constructor.name.replace('SequelizeModel', '');
    return modelName;
  }

  protected getModelNamePlural(item: Model): string {
    return `${this.getModelName(item)}s`;
  }

  /**
   * Assigns a new array of fields to a model instance
   *
   * @param {Model} model - The model instance to be updated.
   * @param {FieldDTO} fields - The model instance to be updated.
   * @returns {Model} Returns updated model
   */
  protected updateModelFields(model: Model, fields: FieldDTO): Model {
    Object.assign(model, fields);
    return model;
  }

  /**
   * Checks if the current user stored in the context state has the necessary permissions to perform an action.
   *
   * @see RequestProcessor#checkPermission
   */
  protected async checkPermission(ctx: RouterContext): Promise<void> {
    this.requestProcessor.checkPermission(ctx);
  }

  /**
   * Processes the payload from the request body.
   *
   * @see RequestProcessor#processPayload
   */
  protected processPayload(ctx: RouterContext, arrayCheck: boolean = false): unknown {
    return this.requestProcessor.processPayload(ctx, arrayCheck);
  }

  /**
   * Processes a parameter from the route parameters.
   *
   * @see RequestProcessor#processParam
   */
  protected processParam(ctx: RouterContext, paramName: string): string {
    return this.requestProcessor.processParam(ctx, paramName);
  }

  /**
   * Processes a parameter from the request body.
   *
   * @see RequestProcessor#processBodyParam
   */
  protected processBodyParam(ctx: RouterContext, paramName: string): string {
    return this.requestProcessor.processBodyParam(ctx, paramName);
  }

  /**
   * Processes a request header.
   *
   * @see RequestProcessor#processHeader
   */
  protected processHeader(ctx: RouterContext, headerName: string): string | string[] | undefined {
    return this.requestProcessor.processHeader(ctx, headerName);
  }

  /**
   * Processes request query parameters
   *
   * @see QueryProcessor#processQueryParams
   */
  protected async processQueryParams(ctx: RouterContext): Promise<FindOptions> {
    return this.queryProcessor.processQueryParams(ctx);
  }
}
