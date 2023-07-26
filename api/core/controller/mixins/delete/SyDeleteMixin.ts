import Router from 'koa-router';
import { Op } from 'sequelize';
import { Transaction } from 'sequelize';

import { SyMixin } from '../SyMixin';
import { ControllerMixinOptions } from '../../types';
import { HttpStatus, Responses } from '../../../lib';
import { BadRequestError, NotFoundError } from '../../../errors/client';

/**
 * SyDeleteMixin is an advanced and comprehensive class which extends SyMixin.
 * It provides functionalities for delete operations including soft delete, hard delete,
 * and bulk delete. It also includes a mechanism for two-step deletion (soft delete
 * before hard delete).
 *
 * @class SyDeleteMixin
 * @extends {SyMixin}
 */
export class SyDeleteMixin extends SyMixin {
  /**
   * Creates an instance of SyDeleteMixin.
   *
   * @param {MixinOptions} options - The options to initiate the Mixin class.
   * @constructor
   */
  constructor(options: ControllerMixinOptions) {
    super(options);
  }

  /**
   * Soft deletes a specific instance of the model by its ID. Soft delete only marks the item as deleted but doesn't remove it from the database.
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   */
  public async softDelete(ctx: Router.RouterContext, transaction: Transaction) {
    const id = this.processIdParam(ctx);
    const item = await this.findItemById(id, transaction);
    const updatedItem = await item.update({ deleted: true }, { transaction });

    if (updatedItem.get('deleted') === true) {
      this.createResponse(ctx, HttpStatus.OK, Responses.SOFT_DEL_OK);
    } else {
      throw new BadRequestError(Responses.SOFT_DEL_FAIL, updatedItem);
    }
  }

  /**
   * Deletes a specific instance of the model by its ID.
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   */
  async delete(ctx: Router.RouterContext, transaction: Transaction) {
    const id = this.processIdParam(ctx);
    const item = await this.findItemById(id, transaction);
    await item.destroy({ transaction });

    this.createResponse(ctx, HttpStatus.OK, Responses.DEL_OK);
  }

  /**
   * Soft deletes a group of items by their IDs.
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   */
  public async bulkSoftDelete(ctx: Router.RouterContext, transaction: Transaction) {
    const ids = this.processIdsParam(ctx);

    const deletedItems = await this.model.update(
      { deleted: true },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
        transaction,
      }
    );

    if (deletedItems[0] === 0) {
      const errorDetails = `Received IDs: ${ids}`;
      throw new NotFoundError(Responses.ITEMS_FAIL, errorDetails);
    } else {
      this.createResponse(ctx, HttpStatus.OK, Responses.SOFT_DELS_OK);
    }
  }

  /**
   * Deletes a group of items by their IDs.
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   */
  public async bulkDelete(ctx: Router.RouterContext, transaction: Transaction) {
    const ids = this.processIdsParam(ctx);

    await this.model.destroy({
      where: { id: ids },
      transaction,
    });

    this.createResponse(ctx, HttpStatus.NO_CONTENT, Responses.DELS_OK);
  }

  /**
   * Archives a specific instance of the model by its ID. Archive only marks the item as archived but doesn't remove it from the database.
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   */
  public async archive(ctx: Router.RouterContext, transaction: Transaction) {
    const id = this.processIdParam(ctx);
    const item = await this.findItemById(id, transaction);
    const updatedItem = await item.update({ archived: true }, { transaction });

    if (updatedItem.get('archived') === true) {
      this.createResponse(ctx, HttpStatus.OK, Responses.ARCHIVE_OK);
    } else {
      throw new BadRequestError(Responses.ARCHIVE_FAIL, updatedItem);
    }
  }
}
