import { exec } from 'child_process';
import { promisify } from 'util';
import { IDatabaseStrategy } from '../types';
import { SyLogger } from '../../../../logging/SyLogger';

/**
 * MysqlStrategy class provides methods for backing up and restoring MySql databases.
 */
class MysqlStrategy implements IDatabaseStrategy {
  private execAsync = promisify(exec);

  constructor(private databasePath: string, private logger: SyLogger) {}

  async backup(): Promise<string | null> {
    const backupPath = `${this.databasePath}.sql`;
    const command = `mysqldump -h host -u username -p password database > ${backupPath}`;

    try {
      await this.execAsync(command);
      return backupPath;
    } catch (error) {
      this.logger.error(`Backup failed: ${error}`);
      return null;
    }
  }

  async restore(backupPath: string): Promise<boolean> {
    const command = `mysql -h host -u username -p password database < ${backupPath}`;

    try {
      await this.execAsync(command);
      return true;
    } catch (error) {
      this.logger.error(`Restore failed: ${error}`);
      return false;
    }
  }
}

export default MysqlStrategy;
