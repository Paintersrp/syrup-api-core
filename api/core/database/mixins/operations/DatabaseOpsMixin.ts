import { Logger } from 'pino';
import { Optional, Sequelize } from 'sequelize';

/**
 * A mixin class that contains methods for performing operations on a database.
 *
 * @remarks
 * This class uses Sequelize for executing SQL queries and Pino for logging.
 * Operations that it can perform include bulk operations within a transaction, executing individual queries, and explaining SQL queries.
 */
export class DatabaseOpsMixin {
  database: Sequelize;
  logger: Logger;

  /**
   * @constructor
   * Constructs a new instance of the DatabaseOpsMixin class.
   *
   * @param database - An instance of the Sequelize class to be used for database operations.
   * @param logger - An instance of the Pino class to be used for logging.
   */
  constructor(database: Sequelize, logger: Logger) {
    this.database = database;
    this.logger = logger;
  }

  /**
   * Executes multiple operations within a single database transaction.
   *
   * @param {Function[]} operations - An array of async functions representing individual operations to be performed within the transaction.
   *
   * @returns {Promise<void>} A Promise that resolves when all operations have been executed successfully, or rejects if any operation fails.
   * If successful, the transaction is committed. If any operation fails, the transaction is rolled back.
   */
  public async performBulkOperations(
    operations: Array<Function>,
    retries: number = 2
  ): Promise<void> {
    for (let i = 0; i <= retries; i++) {
      const t = await this.database.transaction();
      try {
        for (const operation of operations) {
          await operation(t);
        }
        // If all operations were successful, commit the transaction.
        await t.commit();
        break;
      } catch (error) {
        // If any operation failed, roll back the transaction.
        await t.rollback();
        if (i < retries) {
          this.logger.warn('Error occurred during transaction. Retrying...');
        } else {
          this.logger.error('Error occurred during transaction. All retries failed.');
          throw error;
        }
      }
    }
  }

  /**
   * Executes a database query with optional query options and a timeout.
   *
   * @param {string} sql - The SQL query to be executed.
   * @param {any} options - Optional query options to be passed to the database query function.
   * @param {number} timeout - Optional timeout value for the database query, in milliseconds.
   *
   * @returns {Promise<any>} A Promise that resolves with the result of the database query, or rejects if the query encounters an error.
   */
  public async query(sql: string, options: any, timeout: number): Promise<any> {
    if (typeof sql !== 'string') {
      throw new TypeError('sql must be a string');
    }

    if (typeof timeout !== 'number') {
      throw new TypeError('timeout must be a number');
    }

    return await this.database.query(sql, { ...options, timeout });
  }

  /**
   * Executes an EXPLAIN SQL query and logs the result.
   *
   * @param {string} sql - The SQL query to be explained.
   *
   * @returns {Promise<any>} A Promise that resolves with the explanation of the query, or rejects if the query encounters an error.
   */
  public async explainQuery(sql: string): Promise<any> {
    const [result] = await this.database.query(`EXPLAIN ${sql}`);
    this.logger.info(result);
    return result;
  }

  /**
   * Executes a set of SQL queries within a single database transaction.
   *
   * @param {string[]} queries - An array of SQL queries to be executed.
   *
   * @returns {Promise<any>} A Promise that resolves when all queries have been executed successfully, or rejects if any query fails.
   */
  public async compoundQuery(queries: string[]): Promise<any> {
    const operations = queries.map((query) => {
      return async () => {
        await this.database.query(query);
      };
    });
    await this.performBulkOperations(operations);
  }

  /**
   * Inserts a new record into the specified model, or updates it if it already exists.
   *
   * @param {string} model - The name of the model into which the record should be upserted.
   * @param {any} values - The values of the record to be upserted.
   *
   * @returns {Promise<any>} A Promise that resolves with the result of the upsert operation, or rejects if the operation fails.
   */
  public async upsert(model: string, values: Optional<any, string>): Promise<any> {
    const Model = this.database.models[model];
    if (!Model) throw new Error('Model does not exist');
    return Model.upsert(values);
  }
}
