import path from 'path';
import fs from 'fs-extra';
import { Sequelize, Options, Optional } from 'sequelize';

import {
  QueryLogService,
  DatabaseOpsService,
  DatabaseTestService,
  DatabaseRecoveryService,
} from './services';
import { HealthCheckService } from '../server/health';
import { HealthCheck, HealthCheckWithRemediation } from '../server/health/types';
import { SyLogger } from '../logging/SyLogger';

/**
 * @todo Postgres/SQL/MySql in config for restore / backup settings
 * @todo functional restore / backup
 */

/**
 * A class to manage the interaction between your application and the database.
 * This class uses Sequelize for database operations and pino for logging.
 * It also manages database health checks, connection retries, query logging, and error logging.
 * It can be extended to add more features like metrics collection, automated testing, and scalability strategies.
 */
export class SyDatabase {
  public readonly database: Sequelize;
  public readonly path?: string;
  public readonly logger: SyLogger;

  protected recoveryService!: DatabaseRecoveryService;
  protected operationsService!: DatabaseOpsService;
  protected testService!: DatabaseTestService;
  protected queryLogService!: QueryLogService;
  protected healthCheckService!: HealthCheckService;

  /**
   * @constructor
   * @param config - The configuration options for Sequelize.
   * @param logger - The logger instance for general logging.
   * @param queriesLogger - The logger instance for query-specific logging.
   */
  constructor(config: Options, logger: SyLogger) {
    this.database = new Sequelize(config);

    this.logger = logger;

    if (config.dialect === 'sqlite') {
      this.path = config.storage;
    }

    this.initMixins();
  }

  /**
   * @method initMixins
   * @description Initializes instances of RecoveryMixin, OperationsMixin, and DatabaseTestService
   * @returns void
   */
  protected initMixins() {
    this.recoveryService = new DatabaseRecoveryService(this.database, this.logger, this.path);
    this.operationsService = new DatabaseOpsService(this.database, this.logger);
    this.testService = new DatabaseTestService(this.database, this.logger);
    this.queryLogService = new QueryLogService(this.database, this.logger);
    this.healthCheckService = new HealthCheckService(this.logger);
  }

  /**
   * @method startDatabase
   * @description Initiates the database, performs health checks, starts logging, and error handling
   * @returns Promise<void>
   */
  public async startDatabase() {
    this.checkDatabase();
    const environment = process.env.NODE_ENV || 'development';
    if (this.path) {
      const databasePath = path.resolve(__dirname, '../../', this.path);
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
  public async checkDatabase() {
    try {
      await this.database.authenticate();
      this.logger.info('Database connection successful');
      return true;
    } catch (error: any) {
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
      this.queryLogService.startQueryLogging();
      this.queryLogService.startErrorLogging();
      await this.database.sync({ force: false });

      if (databaseExists) {
        this.logger.info('Existing database used.');
      } else {
        this.logger.info('New database created.');
      }

      if (environment === 'test') {
        this.testService.runAutomatedTests();
      }

      if (environment === 'production') {
        // this.implementScalabilityStrategies();
      }
    } catch (error: any) {
      console.log(error.stack);
      this.logger.error('Error connecting to the database:', error);
    }
  }

  /**
   * @method backupDatabase
   * Backs up the current state of the database. The method varies depending on the database dialect.
   *
   * @see DatabaseRecoveryService#backupDatabase
   */
  public async backupDatabase(): Promise<string | null> {
    return this.recoveryService.backupDatabase();
  }

  /**
   * @method restoreDatabase
   * Restores the database from a backup
   *
   * @see DatabaseRecoveryService#restoreDatabase
   */
  public async restoreDatabase(backupPath: string): Promise<boolean> {
    return this.recoveryService.restoreDatabase(backupPath);
  }

  /**
   * @method performBulkOperations
   * Perform bulk operations within a database transaction.
   *
   * @see DatabaseOpsService#performBulkOperations
   */
  public async performBulkOperations(operations: Array<Function>): Promise<void> {
    this.operationsService.performBulkOperations(operations);
  }

  /**
   * @method query
   * Execute a database query with optional query options and a timeout.
   *
   * @see DatabaseOpsService#query
   */
  public async query(sql: string, options: any, timeout: number): Promise<any> {
    return await this.operationsService.query(sql, options, timeout);
  }

  /**
   * @method compoundQuery
   * Executes a set of SQL queries within a single database transaction.
   *
   * @see DatabaseOpsService#compoundQuery
   */
  public async compoundQuery(queries: string[]): Promise<any> {
    return await this.operationsService.compoundQuery(queries);
  }

  /**
   * @method explainQuery
   * Explains a SQL query so it can be analyzed.
   *
   * @see DatabaseOpsService#explainQuery
   */
  public async explainQuery(sql: string): Promise<any> {
    return await this.operationsService.explainQuery(sql);
  }

  /**
   * @method upsert
   * Inserts a new record into the specified model, or updates it if it already exists.
   *
   * @see DatabaseOpsService#upsert
   */
  public async upsert(model: string, values: Optional<any, string>): Promise<any> {
    return await this.operationsService.upsert(model, values);
  }

  /**
   * Begin Health Check Methods
   */

  /**
   * @method registerHealthCheck
   * @description Registers a new health check function with a given name
   *
   * @see HealthCheckService#registerHealthCheck
   */
  public registerHealthCheck(name: string, check: HealthCheck): void {
    this.healthCheckService.registerHealthCheck(name, check);
  }

  /**
   * @method unregisterHealthCheck
   * @description Unregisters a health check function with a given name
   *
   * @see HealthCheckService#unregisterHealthCheck
   */
  public unregisterHealthCheck(name: string): void {
    this.healthCheckService.unregisterHealthCheck(name);
  }

  /**
   * @method performHealthChecks
   * @description Performs all registered health checks
   *
   * @see HealthCheckService#performHealthChecks
   */
  public async performHealthChecks(): Promise<boolean> {
    return this.healthCheckService.performHealthChecks();
  }

  /**
   * @method performHealthCheck
   * @description Executes a health check function by name or direct
   *
   * @see HealthCheckService#performHealthCheck
   */
  public async performHealthCheck(check: string | HealthCheckWithRemediation): Promise<boolean> {
    return this.healthCheckService.performHealthCheck(check);
  }

  /**
   * @method scheduleHealthChecks
   * @description Schedules health checks at a given interval in milliseconds, logs the result
   *
   * @see HealthCheckService#scheduleHealthChecks
   */
  public scheduleHealthChecks(interval: number): void {
    this.healthCheckService.scheduleHealthChecks(interval);
  }

  /**
   * @method stopScheduledHealthChecks
   * @description Stops scheduled health checks if they are currently running
   *
   * @see HealthCheckService#stopScheduledHealthChecks
   */
  public stopScheduledHealthChecks(): void {
    this.healthCheckService.stopScheduledHealthChecks();
  }
}
