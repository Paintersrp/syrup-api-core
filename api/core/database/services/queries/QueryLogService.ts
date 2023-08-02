import { QueryOptions, Sequelize } from 'sequelize';

import * as settings from '../../../../settings';
import { SyLogger } from '../../../logging/SyLogger';
import { FixedAbstractQuery, FixedQueryOptions, QueryLogObjectContext } from './types';

/**
 * @todo USE RESPONSES ENUMS
 * A class that contains methods for logging operations on a database.
 *
 * @remarks
 * This class uses Sequelize for executing SQL queries and Pino for logging.
 * It provides methods for logging errors, starting and stopping query logging, and more.
 */
export class QueryLogService {
  database: Sequelize;
  logger: SyLogger;
  private queryStartTime: Map<string, number>;

  /**
   * @constructor
   * Constructs a new instance of the DatabaseLogMixin class.
   *
   * @param database - An instance of the Sequelize class to be used for database operations.
   * @param logger - An instance of the Pino class to be used for general logging.
   * @param queriesLogger - An instance of the Pino class to be used for logging SQL queries.
   */
  constructor(database: Sequelize, logger: SyLogger) {
    this.database = database;
    this.logger = logger;
    this.queryStartTime = new Map();
  }
  /**
   * @method startErrorLogging
   * @description Begins logging of unhandled promise rejections and SIGINT signals.
   * @returns {void}
   */
  public startErrorLogging(): void {
    process.on('unhandledRejection', (error: any) => {
      this.logger.error('Unhandled Promise Rejection', error);
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
  private beforeQueryHook(_: QueryOptions, query: FixedAbstractQuery): void {
    const queryId = query.uuid as string;
    this.queryStartTime.set(queryId, Date.now());
  }

  /**
   * @method afterQueryHook
   * @description Calculates the duration of the query and logs the information
   * @returns {Promise<void>} A Promise that will resolve when the query log is complete
   */
  private async afterQueryHook(
    options: FixedQueryOptions,
    meta: FixedAbstractQuery
  ): Promise<void> {
    const queryId = meta.uuid as string;
    const startTime = this.queryStartTime.get(queryId);

    if (startTime) {
      const duration = Date.now() - startTime;
      this.queryStartTime.delete(queryId);
      this.logQuery(options, meta, duration);
    }
  }

  /**
   * Logs the executed query and its duration. If the duration is over 2000ms, a warning is logged and the query is further analyzed.
   * @param options - The options object for the query
   * @param meta - The meta object for the query
   * @param duration - The duration of the query in milliseconds.
   * @returns {Promise<void>} A Promise that resolves when the log is complete.
   */
  private async logQuery(
    options: FixedQueryOptions,
    meta: FixedAbstractQuery,
    duration: number
  ): Promise<void> {
    const logObject = this.generateLogObject(options, meta, duration);
    this.logger.logQuery('Query: ', logObject);

    // const logString = this.generateLogString(logObject);
    // this.logger.info(logString);

    if (duration > settings.DATABASE.SLOW_QUERY_THRESHOLD) {
      this.logger.warn(`Slow query detected. Query: ${logObject.sql}, Duration: ${duration}`);
      const explanation = await this.database.query(`EXPLAIN ${logObject.sql}`);
      this.logger.logQuery('Query explanation', { explanation });
    }
  }

  /**
   * Generate a log object based on query options, meta and duration.
   * @param options - The options object for the query
   * @param meta - The meta object for the query
   * @param duration - The duration of the query in milliseconds.
   * @returns {QueryLogObjectContext} The generated log object
   */
  private generateLogObject(
    options: FixedQueryOptions,
    meta: FixedAbstractQuery,
    duration: number
  ): QueryLogObjectContext {
    const id = meta.uuid as string;
    const modelName = meta.model?.name || 'Unknown';
    const sqlParameters = options.attributes;
    const instance = meta.instance || null;

    return {
      id,
      type: options.type || 'unknown',
      modelName,
      sql: meta.sql,
      duration,
      sqlParameters,
      instance,
    };
  }

  /**
   * @todo Use - Currently unused by is relevant to class
   *
   * Generate a log string based on query options, meta and duration.
   * @param logObject - The options object for the query
   * @returns {string} The generated log string
   */
  private generateLogString(logObject: QueryLogObjectContext): string {
    const logString = `Query ${logObject.type} on model ${logObject.modelName || 'Unknown'} took ${
      logObject.duration
    }ms [SQL: ${logObject.sql}]`;

    return logString;
  }
}
