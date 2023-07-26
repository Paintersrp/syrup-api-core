import { Logger } from 'pino';
import { Sequelize, Transaction } from 'sequelize';
import { Cache } from '../../../models';
import { SyLogger } from '../../logging/SyLogger';
import { CacheInterface } from '../types';

/**
 * SyCache is a caching system for the application.
 * It uses the LRU (Least Recently Used) policy for cache eviction.
 */
export class SyPersistMixin<T> {
  private cacheMap: Map<string, CacheInterface<T>>;
  private database: Sequelize;
  private logger: SyLogger;

  constructor(cacheMap: Map<string, CacheInterface<T>>, database: Sequelize, logger: SyLogger) {
    this.cacheMap = cacheMap;
    this.database = database;
    this.logger = logger;
  }

  /**
   * Executes a database transaction. This method automatically commits the transaction if
   * all operations are successful, or rolls back the transaction if any operation fails.
   * In case of a failure, it also logs the error.
   *
   * @param {function} action - A callback function that receives the transaction object and
   * returns a Promise. This function should include all the database operations to be
   * executed in the transaction.
   * @returns {Promise<void>}
   * @throws Will throw an error if the transaction fails.
   */
  protected async executeDatabaseTransaction(
    action: (transaction: Transaction) => Promise<void>
  ): Promise<void> {
    const transaction = await this.database.transaction();
    try {
      await action(transaction);
      await transaction.commit();
    } catch (error: any) {
      await transaction.rollback();
      this.logger.error('Error executing database transaction:', error);
      throw error;
    }
  }

  /**
   * Loads the cache from the database.
   * @returns {Promise<void>}
   */
  public async loadCacheFromDatabase(): Promise<void> {
    try {
      await this.executeDatabaseTransaction(async (transaction) => {
        const cacheData = await Cache.findOne({
          order: [['createdAt', 'DESC']],
          transaction,
        });

        if (cacheData) {
          this.cacheMap = new Map(Object.entries(cacheData.contents));
        }
      });
    } catch (error: any) {
      this.logger.error('Error loading cache to database:', error);
      throw error;
    }
  }

  /**
   * Saves the cache to the database.
   * @returns {Promise<void>}
   */
  public async saveCacheToDatabase(): Promise<void> {
    try {
      await this.executeDatabaseTransaction(async (transaction) => {
        const cacheDataObject: { [key: string]: CacheInterface<T> } = {};
        this.cacheMap.forEach((value, key) => {
          cacheDataObject[key] = value;
        });

        await Cache.create(
          {
            contents: JSON.parse(JSON.stringify(cacheDataObject)),
          },
          { transaction }
        );
      });
    } catch (error: any) {
      this.logger.error('Error saving cache to database:', error);
      throw error;
    }
  }

  /**
   * Clears the cache database.
   * @returns {Promise<void>}
   */
  public async clearDatabase(): Promise<void> {
    try {
      await Cache.destroy({ truncate: true });
      this.logger.info('Cache database cleared.');
    } catch (error: any) {
      this.logger.error('Error clearing cache database:', error);
    }
  }
}
