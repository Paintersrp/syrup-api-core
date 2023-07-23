import Router from 'koa-router';
import { Transaction } from 'sequelize';
import { HttpStatus } from '../../../lib';
import { ControllerMixinOptions } from '../../types';
import { SyMixin } from '../SyMixin';

/**
 * TODO LIST:
 *
 * SyUpdateMixin Class:
 * - [ ] Implement concurrency control for both `update` and `bulkUpdate` methods to handle race conditions
 * - [ ] Implement error handling for `update` method with more specific exceptions, including when a field does not exist or when the data type is incorrect
 * - [ ] Implement error handling for `bulkUpdate` method with more specific exceptions, including handling incomplete data or invalid fields
 * - [ ] Extend `processPayload` method to validate the fields being updated against a schema or model definition
 * - [ ] Enhance `findItemById` method to include more details in the error message, such as which ID was not found
 * - [ ] Implement security measures to prevent sensitive fields from being updated, such as user role or password hash
 * - [ ] Replace `any` TypeScript types in all methods with strict typings to increase type safety and reduce potential bugs
 * - [ ] Implement a transaction rollback mechanism in `bulkUpdate` method in case any single update fails
 * - [ ] Implement detailed logging for `update` and `bulkUpdate` methods, including before and after states and any errors
 * - [ ] Add exception handling for Sequelize's `save` method in `update` and `bulkUpdate` methods to handle database exceptions
 * - [ ] Write comprehensive documentation for all methods in the `SyUpdateMixin` class, including example usage and potential exceptions
 * - [ ] Implement rate-limiting or throttling for `bulkUpdate` method to prevent abuse and overloading
 * - [ ] Add support for partial updates (PATCH) in the `update` method
 *
 * Method Enhancements and New Features:
 * - [ ] Implement a mechanism to optionally check for the existence of an item before updating in `update` and `bulkUpdate` methods
 * - [ ] Implement a method to retrieve the previous state of the items after updating for audit logging purposes
 * - [ ] Implement failure tolerance in `bulkUpdate` method, to continue updating other items even if one update fails
 * - [ ] Add a feature to create a snapshot of the database state before performing bulk updates, for possible rollback
 * - [ ] Implement an event-driven mechanism that emits events on successful or failed updates
 * - [ ] Add a feature to mark certain fields as non-updatable on a per-request basis
 *
 * Test Coverage:
 * - [ ] Add test cases for each public method in the `SyUpdateMixin` class
 * - [ ] Add test cases for handling invalid inputs and ensuring proper error messages are thrown
 * - [ ] Test behavior under high load, ensuring that updates can handle concurrent requests
 * - [ ] Test rollback behavior during failed `bulkUpdate` operations to ensure data integrity
 * - [ ] Mock dependencies like database and logger for unit testing, ensuring tests are isolated and reproducible
 * - [ ] Add stress and performance tests to verify the maximum load the update methods can handle
 *
 * Documentation and Code Quality:
 * - [ ] Improve inline comments for all methods, including private helper methods
 * - [ ] Add JSDoc style comments for all classes, methods, and interfaces, including type definitions and return types
 * - [ ] Refactor code for better readability, including breaking down long methods and improving variable naming
 * - [ ] Create a README.md with usage examples and API documentation, including a simple step-by-step guide for new users
 * - [ ] Review and update existing documentation to ensure it matches the current codebase
 * - [ ] Setup automatic API documentation generation using tools like TypeDoc
 */

interface FieldDTO {
  id?: string;
  [key: string]: any;
}

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

    const item = await this.findItemById(id, transaction);
    Object.assign(item, fields);
    await item.save({ transaction });

    this.createResponse(ctx, HttpStatus.OK, item);
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
    const fields = this.processPayload(ctx, true) as FieldDTO[];

    const updatedItems = await Promise.all(
      fields.map(async (item: any) => {
        const currentItem = await this.findItemById(item.id, transaction);
        Object.assign(currentItem, item);
        await currentItem.save({ transaction });
        return currentItem;
      })
    );
    ctx.status = HttpStatus.OK;
    ctx.body = updatedItems;
  }
}
