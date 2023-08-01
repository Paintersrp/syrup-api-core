import fs from 'fs-extra';
import { SyLogger } from '../../../../logging/SyLogger';
import { IDatabaseStrategy } from '../types';

/**
 * SqliteStrategy class provides methods for backing up and restoring SQLite databases.
 */
class SqliteStrategy implements IDatabaseStrategy {
  constructor(private databasePath: string, private logger: SyLogger) {}

  async backup(): Promise<string | null> {
    try {
      const backupPath = `${this.databasePath}.bak`;
      await fs.copy(this.databasePath, backupPath);
      return backupPath;
    } catch (error) {
      this.logger.error(`Backup failed: ${error}`);
      return null;
    }
  }

  async restore(backupPath: string): Promise<boolean> {
    try {
      await fs.copy(backupPath, this.databasePath);
      return true;
    } catch (error) {
      this.logger.error(`Restore failed: ${error}`);
      return false;
    }
  }
}

export default SqliteStrategy;
