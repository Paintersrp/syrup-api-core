import Router from 'koa-router';
import { Op } from 'sequelize';
import { Transaction } from 'sequelize';

import { SyMixin } from '../SyMixin';
import { ControllerMixinOptions } from '../../types';
import { HttpStatus, ResponseMessages } from '../../../lib';
import { BadRequestError, NotFoundError } from '../../../errors/SyError';

/**
 * @todo SECURITY: Implement authorization checks to ensure only authorized users can delete items.
 * @todo REFACTOR: Extract common logic from the delete and softDelete methods into a private method to reduce code duplication.
 * @todo PERFORMANCE: Benchmark and optimize delete methods for large datasets.
 * @todo ERROR-HANDLING: Implement robust error handling, ensuring meaningful error responses are returned to the user.
 * @todo FUNCTIONALITY: Implement a restore functionality to undo soft deletes.
 * @todo TESTING: Add comprehensive unit and integration tests for all methods.
 * @todo DOCUMENTATION: Improve method and class documentation, providing examples and clarifying use-cases.
 * @todo UX: Improve the clarity and helpfulness of response messages for end users.
 * @todo LOGGING: Add a robust logging mechanism to record the details of deletion actions.
 * @todo VALIDATION: Implement rigorous validation for IDs and other parameters in delete methods.
 * @todo STRATEGY: Revisit the need for and use of transactions. Ensure all database operations are appropriately atomic.
 * @todo SECURITY: Review all dependencies for potential security vulnerabilities and update if necessary.
 * @todo DEPENDENCY: Ensure compatibility with latest versions of Koa, Sequelize and other important dependencies.
 * @todo MONITORING: Set up monitoring to alert in case of excessive deletion operations, which might be an indicator of an issue.
 * @todo STRATEGY: Implement a feature-flagging system for safe rollouts of new delete-related features or changes.
 * @todo PERFORMANCE: Consider a queue-based system for handling bulk deletes to prevent long-running HTTP requests.
 * @todo MAINTENANCE: Review the SyDeleteMixin class for Single Responsibility Principle adherence. Break up if needed.
 */

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
      this.createResponse(ctx, HttpStatus.OK, ResponseMessages.SOFT_DEL_OK);
    } else {
      throw new BadRequestError(ResponseMessages.SOFT_DEL_FAIL, updatedItem);
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

    this.createResponse(ctx, HttpStatus.OK, ResponseMessages.DEL_OK);
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
      throw new NotFoundError(ResponseMessages.ITEMS_FAIL, errorDetails);
    } else {
      this.createResponse(ctx, HttpStatus.OK, ResponseMessages.SOFT_DELS_OK);
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

    this.createResponse(ctx, HttpStatus.NO_CONTENT, ResponseMessages.DELS_OK);
  }
}
