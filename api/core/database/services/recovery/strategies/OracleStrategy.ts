import { exec } from 'child_process';
import { promisify } from 'util';
import { IDatabaseStrategy } from '../types';
import { SyLogger } from '../../../../logging/SyLogger';

/**
 * OracleStrategy class provides methods for backing up and restoring Oracle databases.
 */
class OracleStrategy implements IDatabaseStrategy {
  private execAsync = promisify(exec);

  constructor(private databasePath: string, private logger: SyLogger) {}

  async backup(): Promise<string | null> {
    const backupPath = `${this.databasePath}.dmp`;
    const command = `expdp username/password@db_name directory=oracle_directory dumpfile=${backupPath} logfile=expdp_oracle.log`;

    try {
      await this.execAsync(command);
      return backupPath;
    } catch (error) {
      this.logger.error(`Backup failed: ${error}`);
      return null;
    }
  }

  async restore(backupPath: string): Promise<boolean> {
    const command = `impdp username/password@db_name directory=oracle_directory dumpfile=${backupPath} logfile=impdp_oracle.log`;

    try {
      await this.execAsync(command);
      return true;
    } catch (error) {
      this.logger.error(`Restore failed: ${error}`);
      return false;
    }
  }
}

export default OracleStrategy;
