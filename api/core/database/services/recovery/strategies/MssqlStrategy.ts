import { exec } from 'child_process';
import { promisify } from 'util';
import { IDatabaseStrategy } from '../types';
import { SyLogger } from '../../../../logging/SyLogger';

/**
 * MssqlStrategy class provides methods for backing up and restoring MsSql databases.
 */
class MssqlStrategy implements IDatabaseStrategy {
  private execAsync = promisify(exec);

  constructor(private databasePath: string, private logger: SyLogger) {}

  async backup(): Promise<string | null> {
    const backupPath = `${this.databasePath}.bak`;
    const command = `sqlcmd -S host -U username -P password -Q "BACKUP DATABASE database TO DISK = '${backupPath}'"`;

    try {
      await this.execAsync(command);
      return backupPath;
    } catch (error) {
      this.logger.error(`Backup failed: ${error}`);
      return null;
    }
  }

  async restore(backupPath: string): Promise<boolean> {
    const command = `sqlcmd -S host -U username -P password -Q "RESTORE DATABASE database FROM DISK = '${backupPath}'"`;

    try {
      await this.execAsync(command);
      return true;
    } catch (error) {
      this.logger.error(`Restore failed: ${error}`);
      return false;
    }
  }
}

export default MssqlStrategy;
