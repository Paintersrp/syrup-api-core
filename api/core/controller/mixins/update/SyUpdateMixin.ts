import Router from 'koa-router';
import { Model, Transaction } from 'sequelize';
import { HttpStatus } from '../../../lib';
import { ControllerResponses } from '../../../lib/responses';
import { ControllerMixinOptions } from '../../types';
import { SyMixin } from '../SyMixin';
import { FieldDTO } from '../types';

/**
 * SyUpdateMixin is a mixin class that extends the base SyMixin class and
 * provides methods for updating and bulk updating instances of a model.
 *
 * This class assumes that you have a model with fields that can be updated,
 * and a HTTP context object (`ctx`) which has been validated with a middleware.
 *
 * @example
 * ```typescript
 * const options: ControllerMixinOptions = {
 *   model: sequelize.model('MyModel'),
 *   // additional options...
 * };
 * const myMixin = new SyUpdateMixin(options);
 *
 * // Use `myMixin` in your Koa middleware functions.
 * router.post('/update/:id', async (ctx, next) => {
 *   await myMixin.update(ctx);
 *   await next();
 * });
 * ```
 *
 * @see {@link SyMixin} for the base class.
 * @see {@link ControllerMixinOptions} for the options to pass to the constructor.
 */
export class SyUpdateMixin extends SyMixin {
  /**
   * Constructs a new instance of the Mixin class.
   * @param {ControllerMixinOptions} options Options for initiating the Mixin class.
   */
  constructor(options: ControllerMixinOptions) {
    super(options);
  }

  /**
   * Updates a specific instance of the model by its ID.
   * Validated with validateBody class middleware
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   *
   * @throws Will throw an error if the item does not exist.
   *
   * @example
   * ```typescript
   * // In your Koa route handler...
   * await myMixin.update(ctx, transaction);
   * ```
   */
  public async update(ctx: Router.RouterContext, transaction: Transaction) {
    const id = this.processIdParam(ctx);
    const fields = this.processPayload(ctx) as FieldDTO | undefined;

    const item = (await this.findItemById(id, transaction)) as Model;
    Object.assign(item, fields);
    await item.save({ transaction });

    const modelName = this.getModelName(item);
    this.createResponse(ctx, HttpStatus.OK, item, ControllerResponses.UPDATE_SUCCESS(modelName));
  }

  /**
   * Bulk update instances of the model.
   *
   * This method assumes that the request body is an array of objects, each
   * having an `id` field specifying which instance to update.
   *
   * @param {Router.RouterContext} ctx - The context object from Koa.
   * @param {Transaction} transaction - The Sequelize transaction.
   *
   * @throws Will throw an error if an item does not exist or the payload is invalid.
   *
   * @example
   * ```typescript
   * // In your Koa route handler...
   * await myMixin.bulkUpdate(ctx, transaction);
   * ```
   */
  public async bulkUpdate(ctx: Router.RouterContext, transaction: Transaction) {
    const updatesList = this.processPayload(ctx, true) as FieldDTO[];
    const updatedItems = await this.processBulkUpdates(updatesList, transaction);
    const modelName = this.getModelName(updatedItems[0]);

    this.createResponse(
      ctx,
      HttpStatus.OK,
      updatedItems,
      ControllerResponses.UPDATE_SUCCESS(modelName)
    );
  }

  /**
   * Processes a list of update operations in bulk.
   *
   * This method iterates over the `updates` array, each element of which represents an update operation.
   *
   * @param {FieldDTO[]} updates - An array of update operations. Each operation is an object containing the ID of the target model instance, and the new field values.
   * @param {Transaction} transaction - The Sequelize transaction that all operations should be part of.
   *
   * @returns {Promise<Model[]>} - A promise that resolves to an array of updated model instances.
   *
   * @example
   * ```typescript
   * const updates = [
   *   { id: 1, name: 'New Name' },
   *   { id: 2, status: 'Active' },
   *   // more updates...
   * ];
   * const updatedItems = await this.processBulkUpdates(updates, transaction);
   * ```
   */
  private async processBulkUpdates(
    updates: FieldDTO[],
    transaction: Transaction
  ): Promise<Model[]> {
    return Promise.all(
      updates.map(async (updateData: FieldDTO) => {
        const currentItem = await this.findItemById(updateData.id, transaction);

        this.updateModelFields(currentItem, updateData);
        await currentItem.save({ transaction });

        return currentItem;
      })
    );
  }
}
