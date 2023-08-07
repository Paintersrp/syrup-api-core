import Router from 'koa-router';
import { Optional, Transaction } from 'sequelize';

import { SyMixin } from '../SyMixin';
import { HttpStatus } from '../../../lib';
import { ControllerMixinOptions } from '../../types';
import { ControllerMessages } from '../../../messages/services';
import * as settings from '../../../../settings';

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
   * @param {ControllerMixinOptions} options - The options to initiate the Mixin class.
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
    const item = await this.model.create(payload, { transaction, context: ctx.state.user } as any);

    this.createResponse(
      ctx,
      HttpStatus.CREATED,
      item,
      ControllerMessages.SUCCESS(this.getModelName(item), 'create')
    );
  }

  /**
   * Creates multiple instances of the model.
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   */
  public async bulkCreate(ctx: Router.RouterContext, transaction: Transaction, includes: any[]) {
    const payload = this.processPayload(ctx, true) as Optional<any, string>[];
    const batchSize = settings.CONTROLLERS.MAX_BULK_BATCH_SIZE;
    const batches = Math.ceil(payload.length / batchSize);
    let createdItems: any[] = [];

    for (let i = 0; i < batches; i++) {
      const batch = payload.slice(i * batchSize, (i + 1) * batchSize);
      const batchItems = await this.model.bulkCreate(batch, { transaction, include: includes });
      createdItems = [...createdItems, ...batchItems];
    }

    this.createResponse(
      ctx,
      HttpStatus.CREATED,
      createdItems,
      ControllerMessages.SUCCESS(this.getModelNamePlural(createdItems[0]), 'create')
    );
  }
}
