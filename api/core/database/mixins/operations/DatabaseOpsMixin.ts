import { Logger } from 'pino';
import { Sequelize } from 'sequelize';

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
   * Perform bulk operations within a database transaction.
   *
   * @param operations - An array of async functions representing individual operations to be performed within the transaction.
   *
   * @returns A Promise that resolves when all the operations have been successfully executed within the transaction, or rejects if any operation fails.
   * If successful, the transaction is committed, and if any operation fails, the transaction is rolled back.
   */
  public async performBulkOperations(operations: Array<Function>): Promise<void> {
    const t = await this.database.transaction();

    try {
      for (const operation of operations) {
        await operation(t);
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      this.logger.error('Transaction failed and has been rolled back.', error);
      throw error;
    }
  }

  /**
   * Execute a database query with optional query options and a timeout.
   *
   * @param sql - The SQL query to be executed.
   * @param options - Optional query options to be passed to the database query function.
   * @param timeout - Optional timeout value for the database query, in milliseconds.
   *
   * @returns A Promise that resolves with the result of the database query, or rejects if the query encounters an error.
   */
  public async query(sql: string, options: any, timeout: number): Promise<any> {
    return await this.database.query(sql, { ...options, timeout });
  }

  /**
   * Explains a SQL query so it can be analyzed.   *
   * @param sql - The SQL query to explain.   *
   * @returns A Promise that resolves with the explanation of the query, or rejects if the query encounters an error.
   */
  public async explainQuery(sql: string): Promise<any> {
    const [result] = await this.database.query(`EXPLAIN ${sql}`);
    this.logger.info(result);
    return result;
  }
}
