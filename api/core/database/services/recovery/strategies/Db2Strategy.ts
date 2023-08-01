import { exec } from 'child_process';
import { promisify } from 'util';
import { IDatabaseStrategy } from '../types';
import { SyLogger } from '../../../../logging/SyLogger';

/**
 * Db2Strategy class provides methods for backing up and restoring DB2 databases.
 */
class Db2Strategy implements IDatabaseStrategy {
  private execAsync = promisify(exec);

  constructor(private databasePath: string, private logger: SyLogger) {}

  async backup(): Promise<string | null> {
    const backupPath = `${this.databasePath}.bak`;
    const command = `db2 "BACKUP DATABASE db_name TO ${backupPath}"`;

    try {
      await this.execAsync(command);
      return backupPath;
    } catch (error) {
      this.logger.error(`Backup failed: ${error}`);
      return null;
    }
  }

  async restore(backupPath: string): Promise<boolean> {
    const command = `db2 "RESTORE DATABASE db_name FROM ${backupPath}"`;

    try {
      await this.execAsync(command);
      return true;
    } catch (error) {
      this.logger.error(`Restore failed: ${error}`);
      return false;
    }
  }
}

export default Db2Strategy;
