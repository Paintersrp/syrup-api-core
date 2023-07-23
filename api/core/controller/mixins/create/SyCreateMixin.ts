import Router from 'koa-router';
import { Optional, Transaction } from 'sequelize';
import { HttpStatus } from '../../../lib';

import { SyMixin } from '../SyMixin';
import { ControllerMixinOptions } from '../../types';

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
