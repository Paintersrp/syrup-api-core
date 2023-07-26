import { RouterContext } from 'koa-router';
import { Logger } from 'pino';
import { ModelStatic, FindOptions, Transaction } from 'sequelize';

import { HttpStatus, Responses } from '../../lib';
import { NotFoundError } from '../../errors/client';
import { ControllerMixinOptions } from '../types';
import { RequestProcessor } from './request/RequestProcessor';

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
  protected requestProcessor: RequestProcessor;

  /**
   * Creates an instance of SyMixin.
   *
   * @param {MixinOptions} options - Options to initiate the Mixin class.
   */
  constructor(options: ControllerMixinOptions) {
    this.model = options.model;
    this.logger = options.logger;
    this.requestProcessor = new RequestProcessor(this.model);
  }

  /**
   * Constructs the HTTP response for the Koa router.
   *
   * @param {RouterContext} ctx - Koa Router context.
   * @param {HttpStatus} status - HTTP status code.
   * @param {any} body - Response body.
   */
  protected createResponse(
    ctx: RouterContext,
    status: HttpStatus,
    body: any,
    message?: string,
    error?: string
  ) {
    ctx.status = status;
    ctx.body = {
      status: status >= 200 && status < 300 ? 'success' : 'error',
      message,
      data: body,
      errorCode: error || null,
    };
  }

  /**
   * Finds an item by its 'id' in the model.
   * Throws a NotFoundError if the item is not found in the database.
   *
   * @param {string} id - The id of the item to be found.
   * @param {Transaction} transaction - The Sequelize transaction.
   * @returns {Promise<any>} A promise that resolves to the found item.
   */
  protected async findItemById(id: string, transaction?: Transaction): Promise<any> {
    const item = await this.model.findByPk(id, { transaction });
    this.assertItemExists(item, Responses.ID_FAIL);
    return item;
  }

  /**
   * Asserts an item exists
   *
   * @throws {NotFoundError} If the item is not found.
   */
  private assertItemExists(item: any, failMsg: Responses = Responses.ITEM_FAIL): void {
    if (!item) {
      throw new NotFoundError(failMsg, item);
    }
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
  protected processPayload(ctx: RouterContext, arrayCheck: boolean = false): any {
    return this.requestProcessor.processPayload(ctx, arrayCheck);
  }

  /**
   * Processes the 'id' parameter from the Koa Router context.
   *
   * @see RequestProcessor#processIdParam
   */
  protected processIdParam(ctx: RouterContext): string {
    return this.requestProcessor.processIdParam(ctx);
  }

  /**
   * Processes the 'ids' parameter from the request body.
   *
   * @see RequestProcessor#processIdsParam
   */
  protected processIdsParam(ctx: RouterContext): string[] {
    return this.requestProcessor.processIdsParam(ctx);
  }

  /**
   * Processes request query parameters
   *
   * @see RequestProcessor#processQueryParams
   */
  protected async processQueryParams(ctx: RouterContext): Promise<FindOptions> {
    return this.requestProcessor.processQueryParams(ctx);
  }
}
