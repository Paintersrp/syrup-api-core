import { Logger } from 'pino';
import { Sequelize } from 'sequelize';

/**
 * A mixin class that contains methods for logging operations on a database.
 *
 * @remarks
 * This class uses Sequelize for executing SQL queries and Pino for logging.
 * It provides methods for logging errors, starting and stopping query logging, and more.
 */
export class DatabaseLogMixin {
  database: Sequelize;
  logger: Logger;
  queriesLogger: Logger;

  /**
   * @constructor
   * Constructs a new instance of the DatabaseLogMixin class.
   *
   * @param database - An instance of the Sequelize class to be used for database operations.
   * @param logger - An instance of the Pino class to be used for general logging.
   * @param queriesLogger - An instance of the Pino class to be used for logging SQL queries.
   */
  constructor(database: Sequelize, logger: Logger, queriesLogger: Logger) {
    this.database = database;
    this.logger = logger;
    this.queriesLogger = queriesLogger;
  }
  /**
   * @method startErrorLogging
   * @description Begins logging of unhandled promise rejections and SIGINT signals.
   * @returns {void}
   */
  public startErrorLogging(): void {
    process.on('unhandledRejection', (error) => {
      this.logger.error(error, 'Unhandled Promise Rejection');
    });

    process.on('SIGINT', async () => {
      await this.database.close();
      this.logger.info('Database connection closed');
      process.exit(0);
    });
  }

  /**
   * @method startQueryLogging
   * @description Starts query logging before and after every SQL query
   * @returns {Promise<void>}
   */
  public async startQueryLogging(): Promise<void> {
    this.database.addHook('beforeQuery', this.beforeQueryHook.bind(this));
    this.database.addHook('afterQuery', this.afterQueryHook.bind(this));
  }

  /**
   * @method beforeQueryHook
   * @description Adds a timestamp to the query options object to allow for duration calculation
   * @returns {void}
   */
  private beforeQueryHook(options: any): void {
    options.start_time = Date.now();
  }

  /**
   * @method afterQueryHook
   * @description Calculates the duration of the query and logs the information
   * @returns {Promise<void>} A Promise that will resolve when the query log is complete
   */
  private async afterQueryHook(_: any, options: any): Promise<void> {
    const duration = Date.now() - options.start_time;
    this.logQuery(options.sql, duration);
  }

  /**
   * Logs the executed query and its duration. If the duration is over 2000ms, a warning is logged and the query is further analyzed.
   *
   * @param sql - The SQL query that was executed.
   * @param duration - The duration of the query in milliseconds.
   *
   * @returns A Promise that resolves when the log is complete.
   */
  private async logQuery(sql: string, duration: number): Promise<void> {
    this.queriesLogger.info({ query: sql, duration }, 'Executed query');
    if (duration > 2000) {
      this.logger.warn(`Slow query detected. Query: ${sql}, Duration: ${duration}`);
      const explanation = await this.database.query(`EXPLAIN ${sql}`);
      this.logger.info({ explanation }, 'Query explanation');
    }
  }
}
