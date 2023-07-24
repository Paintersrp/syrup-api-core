import path from 'path';
import fs from 'fs-extra';
import { Sequelize, Options } from 'sequelize';
import { Logger } from 'pino';

import { Retry } from '../lib/decorators/general';
import {
  DatabaseLogMixin,
  DatabaseOpsMixin,
  DatabaseRecoveryMixin,
  DatabaseTestMixin,
} from './mixins';
import { HealthCheck } from './types';

/**
 * @todo Postgres/SQL/MySql in config for restore / backup settings
 */

/**
 * A class to manage the interaction between your application and the database.
 * This class uses Sequelize for database operations and pino for logging.
 * It also manages database health checks, connection retries, query logging, and error logging.
 * It can be extended to add more features like metrics collection, automated testing, and scalability strategies.
 */
export class SyDatabase {
  public readonly database: Sequelize;
  public readonly databasePath?: string;
  public readonly logger: Logger;
  public readonly queriesLogger: Logger;
  private healthChecks: HealthCheck[] = [];

  declare recoveryMixin: DatabaseRecoveryMixin;
  declare operationsMixin: DatabaseOpsMixin;
  declare testMixin: DatabaseTestMixin;
  declare logMixin: DatabaseLogMixin;

  /**
   * @constructor
   * @param config - The configuration options for Sequelize.
   * @param logger - The logger instance for general logging.
   * @param queriesLogger - The logger instance for query-specific logging.
   */
  constructor(config: Options, logger: Logger, queriesLogger: Logger) {
    this.database = new Sequelize(config);

    this.logger = logger;
    this.queriesLogger = queriesLogger;

    if (config.dialect === 'sqlite') {
      this.databasePath = config.storage;
    }

    this.initMixins();
  }

  /**
   * @method initMixins
   * @description Initializes instances of RecoveryMixin, OperationsMixin, and DatabaseTestMixin
   * @returns void
   */
  protected initMixins() {
    this.recoveryMixin = new DatabaseRecoveryMixin(this.database, this.logger, this.databasePath);
    this.operationsMixin = new DatabaseOpsMixin(this.database, this.logger);
    this.testMixin = new DatabaseTestMixin(this.database, this.logger);
    this.logMixin = new DatabaseLogMixin(this.database, this.logger, this.queriesLogger);
  }

  /**
   * @method startDatabase
   * @description Initiates the database, performs health checks, starts logging, and error handling
   * @returns Promise<void>
   */
  public async startDatabase() {
    this.checkDatabase();
    const environment = process.env.NODE_ENV || 'development';
    if (this.databasePath) {
      const databasePath = path.resolve(__dirname, '../../', this.databasePath);
      await this.syncAndLogDatabase(databasePath, environment);
    } else {
      this.logger.error('No database path');
    }
  }

  /**
   * @method checkDatabase
   * @description Checks the database connection status
   * @returns Promise<boolean>
   */
  @Retry({ retries: 3, retryDelay: 1000, exponentialBackoff: true, backoffMultiplier: 3 })
  public async checkDatabase() {
    try {
      await this.database.authenticate();
      this.logger.info('Database connection successful');
      return true;
    } catch (error) {
      this.logger.error('Database connection failed.', error);
      return false;
    }
  }

  /**
   * @method syncAndLogDatabase
   * @description Starts query logging and error logging, syncs the database, logs database status,
   * runs automated tests in test environment, and implements scalability strategies in production environment
   * @param {string} databasePath - The path to the database
   * @param {string} environment - The environment in which the application is running
   * @returns {Promise<void>} A Promise that resolves when the operations are complete
   */
  private async syncAndLogDatabase(databasePath: string, environment: string): Promise<void> {
    try {
      const databaseExists = fs.existsSync(databasePath);
      this.logMixin.startQueryLogging();
      this.logMixin.startErrorLogging();
      await this.database.sync({ force: false });

      if (databaseExists) {
        this.logger.info('Existing database used.');
      } else {
        this.logger.info('New database created.');
      }

      if (environment === 'test') {
        this.testMixin.runAutomatedTests();
      }

      if (environment === 'production') {
        // this.implementScalabilityStrategies();
      }
    } catch (error) {
      this.logger.error('Error connecting to the database:', error);
    }
  }

  /**
   * @method backupDatabase
   * Backs up the current state of the database. The method varies depending on the database dialect.
   *
   * @see DatabaseRecoveryMixin#backupDatabase
   */
  public async backupDatabase(): Promise<string | null> {
    return this.recoveryMixin.backupDatabase();
  }

  /**
   * @method restoreDatabase
   * Restores the database from a backup
   *
   * @see DatabaseRecoveryMixin#restoreDatabase
   */
  public async restoreDatabase(backupPath: string): Promise<boolean> {
    return this.recoveryMixin.restoreDatabase(backupPath);
  }

  /**
   * @method performBulkOperations
   * Perform bulk operations within a database transaction.
   *
   * @see DatabaseOpsMixin#performBulkOperations
   */
  public async performBulkOperations(operations: Array<Function>): Promise<void> {
    this.operationsMixin.performBulkOperations(operations);
  }

  /**
   * @method query
   * Execute a database query with optional query options and a timeout.
   *
   * @see DatabaseOpsMixin#query
   */
  public async query(sql: string, options: any, timeout: number): Promise<any> {
    return await this.operationsMixin.query(sql, options, timeout);
  }

  /**
   * @method explainQuery
   * Explains a SQL query so it can be analyzed.
   *
   * @see DatabaseOpsMixin#explainQuery
   */
  public async explainQuery(sql: string): Promise<any> {
    return await this.operationsMixin.explainQuery(sql);
  }

  /**
   * @method registerHealthCheck
   * @description Registers a new health check function
   * @returns {void}
   */
  public registerHealthCheck(check: HealthCheck): void {
    this.healthChecks.push(check);
  }

  /**
   * @method performHealthChecks
   * @description Performs all registered health checks
   * @returns {Promise<boolean>}
   */
  public async performHealthChecks(): Promise<boolean> {
    for (let check of this.healthChecks) {
      if (!(await this.performHealthCheck(check))) {
        return false;
      }
    }
    return true;
  }

  /**
   * @method performHealthCheck
   * @description Executes a health check function, logs an error if the check fails
   * @param {HealthCheck} check - A function that performs a health check and returns a Promise<boolean> indicating the health status
   * @returns {Promise<boolean>}
   */
  private async performHealthCheck(check: HealthCheck): Promise<boolean> {
    try {
      const result = await check();
      if (!result) {
        throw new Error('Health check failed');
      }
      return true;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return false;
    }
  }
}
