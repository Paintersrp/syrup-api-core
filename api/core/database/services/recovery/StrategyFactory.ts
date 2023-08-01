import { Sequelize } from 'sequelize';
import { SyLogger } from '../../../logging/SyLogger';
import { IDatabaseStrategy } from './types';

/**
 * The StrategyFactory class is responsible for instantiating and returning the appropriate
 * database strategy based on the database dialect (type).
 */
export class StrategyFactory {
  constructor(private database: Sequelize, private logger: SyLogger) {}

  /**
   * Dynamically imports and instantiates the correct database strategy based on the Sequelize instance's dialect.
   *
   * The strategy module is expected to be located at `./strategies/${Dialect}Strategy`, with a default export being a class that implements the IDatabaseStrategy interface.
   *
   * For instance, if the dialect is 'sqlite', the StrategyFactory will attempt to import './strategies/SqliteStrategy', and to instantiate and return a new instance of the SqliteStrategy
   * class.
   *
   * @param databasePath The path of the database file (only relevant for file-based databases like
   * SQLite).
   *
   * @returns A Promise that resolves to an instance of a class implementing the IDatabaseStrategy interface.
   *
   * @throws {Error} Throws an error if no default export is found in the corresponding strategy
   * module, or if the strategy module does not exist (i.e., the dialect is unsupported).
   */
  async getStrategy(databasePath: string): Promise<IDatabaseStrategy> {
    const dialect = this.database.getDialect();
    const formattedDialect = dialect.charAt(0).toUpperCase() + dialect.slice(1);

    try {
      const module = await import(`./strategies/${formattedDialect}Strategy`);
      const StrategyClass = module.default;

      if (!StrategyClass) {
        throw new Error(`No default export in './strategies/${formattedDialect}Strategy'`);
      }

      return new StrategyClass(databasePath, this.logger);
    } catch (error) {
      throw new Error(
        `Unsupported database dialect "${formattedDialect}" or strategy not found: ${error}`
      );
    }
  }
}
