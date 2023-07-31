import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';

import { Sequelize } from 'sequelize';
import { SyLogger } from '../../../logging/SyLogger';

/**
 * A mixin class that contains methods for performing backup and restore operations on a database.
 *
 * @remarks
 * This class uses Sequelize for interacting with the database and Pino for logging.
 * It provides methods for backing up and restoring the database.
 */
export class DatabaseRecoveryMixin {
  database: Sequelize;
  logger: SyLogger;
  databasePath?: string;

  /**
   * @constructor
   * Constructs a new instance of the DatabaseRecoveryMixin class.
   *
   * @param database - An instance of the Sequelize class to be used for database operations.
   * @param logger - An instance of the Pino class to be used for logging.
   * @param databasePath - Path to the database file, used for SQLite databases.
   */
  constructor(database: Sequelize, logger: SyLogger, databasePath?: string) {
    this.database = database;
    this.logger = logger;
    this.databasePath = databasePath;
  }

  /**
   * Backs up the current state of the database. The method varies depending on the database dialect.
   *
   * @remarks
   * For SQLite, this involves making a copy of the database file.
   * For MySQL/MariaDB and PostgreSQL, this involves running a utility command to generate a dump file.
   *
   * @returns The path of the backup file if the backup was successful, or null otherwise.
   * @throws An error if the database dialect is unsupported or if the backup operation fails.
   */
  public async backupDatabase(): Promise<string | null> {
    const execAsync = promisify(exec);
    let command = '';
    let backupPath = '';

    switch (this.database.getDialect()) {
      case 'sqlite': {
        if (this.databasePath) {
          backupPath = `${this.databasePath}.bak`;
          await fs.copy(this.databasePath, backupPath);
        }
        break;
      }
      case 'mysql':
      case 'mariadb': {
        backupPath = `${this.databasePath}.sql`;
        command = `mysqldump -h host -u username -p password database > ${backupPath}`;
        break;
      }
      case 'postgres': {
        backupPath = `${this.databasePath}.sql`;
        command = `pg_dump -h host -U username -f ${backupPath} database`;
        break;
      }
      default:
        this.logger.error('Unsupported database dialect for backup');
        return null;
    }

    if (command) {
      try {
        await execAsync(command);
      } catch (error) {
        this.logger.error(`Backup failed: ${error}`);
        return null;
      }
    }

    return backupPath;
  }

  /**
   * Restores the database from a backup. The method varies depending on the database dialect.
   *
   * @remarks
   * For SQLite, this involves replacing the current database file with the backup file.
   * For MySQL/MariaDB and PostgreSQL, this involves running a utility command to restore the database from a dump file.
   *
   * @param backupPath - The path to the backup file that should be used to restore the database.
   * @returns A promise that resolves to true if the restore operation was successful, or false otherwise.
   * @throws An error if the database dialect is unsupported or if the restore operation fails.
   */
  public async restoreDatabase(backupPath: string): Promise<boolean> {
    const execAsync = promisify(exec);
    let command = '';

    switch (this.database.getDialect()) {
      case 'sqlite': {
        if (this.databasePath) {
          await fs.copy(backupPath, this.databasePath);
        }
        break;
      }
      case 'mysql':
      case 'mariadb': {
        command = `mysql -h host -u username -p password database < ${backupPath}`;
        break;
      }
      case 'postgres': {
        command = `psql -h host -U username -d database -f ${backupPath}`;
        break;
      }
      default:
        this.logger.error('Unsupported database dialect for restore');
        return false;
    }

    if (command) {
      try {
        await execAsync(command);
      } catch (error) {
        this.logger.error(`Restore failed: ${error}`);
        return false;
      }
    }

    return true;
  }
}
