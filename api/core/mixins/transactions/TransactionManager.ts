import { RouterContext } from 'koa-router';
import { Logger } from 'pino';
import { Transaction } from 'sequelize';
import { ORM } from '../../../settings';
import { InternalServerError } from '../../errors/server';
import { Responses } from '../../lib';

export class TransactionManager {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Performs a transactional operation given a context, action name and a Mixin object.
   * @param {RouterContext} ctx - Koa RouterContext.
   * @param {string} action - The action to be performed on the Mixin.
   * @param {Object} mixin - The Mixin object which has the action method.
   * @return {Promise<void>} Promise represents the completion of the transactional operation.
   */
  public async performTransaction(ctx: RouterContext, action: string, mixin: any): Promise<void> {
    return this.withTransaction(ctx, async (transaction) => {
      return mixin[action](ctx, transaction);
    });
  }

  /**
   * Wraps a callback function within a database transaction.
   * If any operation within the transaction fails, all operations are rolled back.
   * The error is also emitted as an event and can be listened to.
   * @param {RouterContext} ctx - Koa RouterContext.
   * @param {Function} callback - Callback function to be executed within the transaction.
   * @return {Promise<T>} The result of the callback function execution.
   * @emits SyController#error
   */
  private async withTransaction<T>(
    ctx: RouterContext,
    callback: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    let transaction: Transaction | null = null;

    try {
      transaction = await ORM.database.transaction();

      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(error, 'Transaction failed');
      console.log(error);
      throw new InternalServerError(Responses.INTERNAL_SERVER, transaction as any, ctx.url);
    }
  }
}
