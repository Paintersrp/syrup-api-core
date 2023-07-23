import Router from 'koa-router';
import { Optional, Transaction } from 'sequelize';
import { HttpStatus } from '../../../lib';

import { SyMixin } from '../SyMixin';
import { ControllerMixinOptions } from '../../types';

/**
 * @todo - Implement robust user authentication and access control mechanisms to prevent unauthorized instance creation
 * @todo - Add comprehensive error handling and recovery for the `create` and `bulkCreate` methods, including Sequelize transaction rollbacks where applicable
 * @todo - Integrate structured logging using a logging library (e.g., Winston or Bunyan) to facilitate debugging, error tracking, and application monitoring
 * @todo - Include data validation and sanitation before creating instances to prevent SQL injection attacks and ensure data consistency
 * @todo - Review and revise JsDoc comments to ensure they accurately describe the functionality and behavior of each method and class
 * @todo - Develop extensive unit and integration tests to confirm correct functionality, including tests for edge cases and unexpected inputs
 * @todo - Implement additional RESTful endpoints as needed to support operations like update, delete, and read for completeness
 * @todo - Add rate limiting to protect the API from abuse and maintain service quality
 * @todo - Implement input payload size limits to prevent large payloads from causing memory or performance issues
 * @todo - Consider adding pagination to the bulk create endpoint, to support large numbers of creations without overloading the server
 * @todo - Develop performance benchmarks and conduct performance testing to ensure the application meets necessary performance criteria
 * @todo - Consider using dependency injection to make the class more modular and easier to unit test
 * @todo - Document all API endpoints using a tool such as Swagger, to provide easy-to-understand API documentation for end users
 */

/**
 * SyCreateMixin is a mixin class which extends the abstract SyMixin.
 * It provides functionality for creating instances of a model, including single
 * and bulk creations.
 *
 * @class SyCreateMixin
 * @extends {SyMixin}
 */
export class SyCreateMixin extends SyMixin {
  /**
   * Creates an instance of SyCreateMixin.
   *
   * @param {MixinOptions} options - The options to initiate the Mixin class.
   * @constructor
   */
  constructor(options: ControllerMixinOptions) {
    super(options);
  }

  /**
   * Creates a new instance of the model.
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   */
  public async create(ctx: Router.RouterContext, transaction: Transaction) {
    const payload = this.processPayload(ctx) as Optional<any, string> | undefined;
    const item = await this.model.create(payload, { transaction });

    this.createResponse(ctx, HttpStatus.CREATED, item);
  }

  /**
   * Creates multiple instances of the model.
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   */
  public async bulkCreate(ctx: Router.RouterContext, transaction: Transaction) {
    const payload = this.processPayload(ctx, true) as Optional<any, string>[];
    const createdItems = await this.model.bulkCreate(payload, { transaction });

    this.createResponse(ctx, HttpStatus.CREATED, createdItems);
  }
}
