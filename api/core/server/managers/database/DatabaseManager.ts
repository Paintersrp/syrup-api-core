import { SyDatabase } from '../../../database';

/**
 * Manages the starting and backing up of the database.
 * This class encapsulates the methods to initialize and manage the database system.
 */
export class DatabaseManager {
  /**
   * @param {SyDatabase} ORM - An instance of the ORM (Object-Relational Mapping) to manage the database operations.
   */
  constructor(private ORM: SyDatabase) {}

  /**
   * Starts the database connection.
   * @public
   * @async
   * @returns {Promise<void>}
   */
  async startDatabase(): Promise<void> {
    await this.ORM.startDatabase();
  }

  /**
   * Backs up the database.
   * @public
   * @async
   * @returns {Promise<void>}
   */
  async backupDatabase(): Promise<void> {
    await this.ORM.backupDatabase();
  }
}
