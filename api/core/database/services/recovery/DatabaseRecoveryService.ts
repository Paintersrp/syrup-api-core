import { Sequelize } from 'sequelize';
import { SyLogger } from '../../../logging/SyLogger';
import { StrategyFactory } from './StrategyFactory';

/**
 * The DatabaseRecoveryService class provides methods for backing up and restoring a database.
 * It uses a StrategyFactory to create the appropriate strategy for handling these operations based on the database type.
 */
export class DatabaseRecoveryService {
  database: Sequelize;
  logger: SyLogger;
  databasePath?: string;
  strategyFactory: StrategyFactory;

  /**
   * Creates an instance of DatabaseRecoveryService.
   * @param database The Sequelize instance representing the database to be backed up or restored.
   * @param logger The instance of SyLogger used for logging.
   * @param databasePath The path to the database file, if applicable.
   */
  constructor(database: Sequelize, logger: SyLogger, databasePath?: string) {
    this.database = database;
    this.logger = logger;
    this.databasePath = databasePath;
    this.strategyFactory = new StrategyFactory(database, logger);
  }

  /**
   * Backs up the database.
   * @returns The path to the backup file if the backup is successful, otherwise null.
   */
  public async backupDatabase(): Promise<string | null> {
    try {
      await this.database.authenticate();
    } catch (error: any) {
      this.logger.error('Database connection failed', error);
      return null;
    }

    if (!this.databasePath) {
      throw new Error('Database path not specified');
    }

    const strategy = await this.strategyFactory.getStrategy(this.databasePath);
    return await strategy.backup(this.databasePath);
  }

  /**
   * Restores the database from a backup.
   * @param backupPath The path to the backup file.
   * @returns A boolean indicating whether the restore operation was successful.
   */
  public async restoreDatabase(backupPath: string): Promise<boolean> {
    try {
      await this.database.authenticate();
    } catch (error: any) {
      this.logger.error('Database connection failed', error);
      return false;
    }

    const strategy = await this.strategyFactory.getStrategy(this.databasePath!);
    return await strategy.restore(backupPath);
  }
}
