import { exec } from 'child_process';
import { promisify } from 'util';
import { IDatabaseStrategy } from '../types';
import { SyLogger } from '../../../../logging/SyLogger';

/**
 * PostgresStrategy class provides methods for backing up and restoring Postgres databases.
 */
class PostgresStrategy implements IDatabaseStrategy {
  private execAsync = promisify(exec);

  constructor(private databasePath: string, private logger: SyLogger) {}

  async backup(): Promise<string | null> {
    const backupPath = `${this.databasePath}.sql`;
    const command = `pg_dump -h host -U username -f ${backupPath} database`;

    try {
      await this.execAsync(command);
      return backupPath;
    } catch (error) {
      this.logger.error(`Backup failed: ${error}`);
      return null;
    }
  }

  async restore(backupPath: string): Promise<boolean> {
    const command = `psql -h host -U username -d database -f ${backupPath}`;

    try {
      await this.execAsync(command);
      return true;
    } catch (error) {
      this.logger.error(`Restore failed: ${error}`);
      return false;
    }
  }
}

export default PostgresStrategy;
