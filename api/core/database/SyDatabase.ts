import path from 'path';
import fs from 'fs-extra';
import { Sequelize, Options } from 'sequelize';
import { Logger } from 'pino';

/**
 * A class to manage the interaction between your application and the database.
 * This class uses Sequelize for database operations and pino for logging.
 * It also manages database health checks, connection retries, query logging, and error logging.
 * It can be extended to add more features like metrics collection, automated testing, and scalability strategies.
 */
export class SyDatabase {
  database: Sequelize;
  databasePath?: string;
  logger: Logger;
  queriesLogger: Logger;

  /**
   * Constructs a new SyDatabase instance.
   * @param config The configuration options for Sequelize.
   * @param logger The logger instance for general logging.
   * @param queriesLogger The logger instance for query-specific logging.
   */
  constructor(config: Options, logger: Logger, queriesLogger: Logger) {
    this.database = new Sequelize(config);
    this.logger = logger;
    this.queriesLogger = queriesLogger;

    if (config.dialect === 'sqlite') {
      this.databasePath = config.storage;
    }
  }

  /**
   * Checks the database connection status.
   * @param options Optional parameters for configuring the database check.
   * @param options.retries The number of times to retry the connection check if it fails. Defaults to 3.
   * @param options.retryDelay The delay in milliseconds between retries. Defaults to 1000.
   * @returns A promise that resolves to a boolean indicating the database health.
   */
  async checkDatabase(options?: { retries?: number; retryDelay?: number }): Promise<boolean> {
    const maxRetries = options?.retries ?? 3;
    const retryDelay = options?.retryDelay ?? 1000;
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
      try {
        await this.database.authenticate();
        this.logger.info('Database connection successful');
        return true;
      } catch (error) {
        this.logger.error('Error occurred during database connection check:', error);
        currentRetry++;

        if (currentRetry < maxRetries) {
          this.logger.info(`Retrying database connection in ${retryDelay}ms...`);
          await this.waitAndRetry(retryDelay);
        }
      }
    }

    this.logger.error('Max retry attempts reached. Database connection failed.');
    return false;
  }

  /**
   * Waits for a given duration and retries the database connection check.
   * @param duration The delay in milliseconds before retrying the connection check.
   * @returns A promise that resolves when the delay has completed.
   */
  async waitAndRetry(duration: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  /**
   * Starts the database, performs health checks, logging, and error handling.
   * Can also be configured to run automated tests and implement scalability strategies based on the environment.
   */
  async startDatabase() {
    const environment = process.env.NODE_ENV || 'development';

    if (this.databasePath) {
      try {
        const databasePath = path.resolve(__dirname, '../', this.databasePath);
        const databaseExists = fs.existsSync(databasePath);

        // this.startMetricsCollection();
        this.startQueryLogging();
        this.startErrorLogging();

        await this.database.sync({ force: false });

        if (databaseExists) {
          this.logger.info('Existing database used.');
        } else {
          this.logger.info('New database created.');
          // Perform seeding here? Dev only?
        }
      } catch (error) {
        this.logger.error('Error connecting to the database:', error);
      }

      if (environment === 'test') {
        this.runAutomatedTests();
      }

      if (environment === 'production') {
        // this.implementScalabilityStrategies();
      }
    } else {
      this.logger.error('No database path');
    }
  }

  /**
   * Backs up the database if the dialect is SQLite. If successful, the backup file path is returned.
   * @returns The path of the backup file.
   */
  async backupDatabase(): Promise<string | null> {
    if (this.databasePath && this.database.getDialect() === 'sqlite') {
      const backupPath = `${this.databasePath}.bak`;
      await fs.copy(this.databasePath, backupPath);
      return backupPath;
    }
    return null;
  }

  /**
   * Explains a SQL query so it can be analyzed.
   * @param sql The SQL query to explain.
   * @returns The explanation of the query.
   */
  async explainQuery(sql: string): Promise<any> {
    const [result] = await this.database.query(`EXPLAIN ${sql}`);
    return result;
  }

  /**
   * Adds hooks to the Sequelize instance to start logging before and after every query.
   */
  private startQueryLogging() {
    this.database.addHook('beforeQuery', (options: any) => {
      options.start_time = Date.now();
    });

    this.database.addHook('afterQuery', (_, options: any) => {
      const duration = Date.now() - options.start_time;
      this.queriesLogger.info({ query: options.sql, duration }, 'Executed query');
      if (duration > 2000) {
        this.logger.warn(`Slow query detected. Query: ${options.sql}, Duration: ${duration}`);
      }
    });
  }

  /**
   * Starts logging unhandled promise rejections using the general logger.
   */
  private startErrorLogging() {
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
   * Runs automated tests on the database to ensure it's functioning correctly.
   * For example, it might check that basic arithmetic operations are working as expected.
   *
   * @todo Extend this method to add more complex tests.
   */
  private runAutomatedTests() {
    // Implement some actual testing
    this.database
      .query('SELECT 1+1 AS result')
      .then(([result]: any) => {
        if (result[0]['result'] !== 2) {
          throw new Error('1+1 did not equal 2');
        }
        this.logger.info(result);
      })
      .catch((err) => {
        this.logger.error('Test failed:', err);
      });
  }
}
