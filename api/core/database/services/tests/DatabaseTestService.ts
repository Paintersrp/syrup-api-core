import { Sequelize } from 'sequelize';
import { faker } from '@faker-js/faker';

import { Timer } from '../../../lib/decorators/general';
import { SyLogger } from '../../../logging/SyLogger';

/**
 * A mixin class that contains methods for testing various aspects of a database.
 * It is used to simulate high load situations, test CRUD operations and test transactions.
 *
 * @remarks
 * This class uses Sequelize for interacting with the database, Pino for logging and Faker for generating fake data.
 */
export class DatabaseTestService {
  database: Sequelize;
  logger: SyLogger;

  /**
   * @constructor
   * Constructs a new instance of the DatabaseTestMixin class.
   *
   * @param database - An instance of the Sequelize class to be used for database operations.
   * @param logger - An instance of the Pino class to be used for logging.
   */
  constructor(database: Sequelize, logger: SyLogger) {
    this.database = database;
    this.logger = logger;
  }

  /**
   * Runs all automated tests.
   * @method runAutomatedTests
   */
  @Timer
  public async runAutomatedTests() {
    await this.testCRUDOperations();
    await this.testTransactions();
    await this.simulateHighLoad();
  }

  /**
   * Simulates a high load situation by creating 1000 profiles.
   * @method simulateHighLoad
   */
  @Timer
  public async simulateHighLoad() {
    const Profile = this.database.model('Profile');
    const profiles = Array(1000)
      .fill(0)
      .map(() => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      }));

    try {
      await Profile.bulkCreate(profiles);
      this.logger.info(`High load simulation succeeded`);
    } catch (err: any) {
      this.logger.error('High load simulation failed:', err);
    }
  }

  /**
   * Runs CRUD operations test.
   * @method testCRUDOperations
   */
  @Timer
  public async testCRUDOperations() {
    const User = this.database.model('User');
    try {
      const user = await User.create({ username: 'CakeTits', password: 'YeetBoi69!' });
      const readUser = await User.findOne({ where: { username: 'CakeTits' } });
      const updatedUser = await User.update(
        { username: 'CakeTits69' },
        { where: { username: 'CakeTits' } }
      );
      const deletedUser = await User.destroy({ where: { username: 'CakeTits69' } });

      if (!readUser || !updatedUser || !deletedUser) {
        throw new Error('CRUD operation failed');
      }
      this.logger.info('CRUD operation succeeded');
    } catch (err: any) {
      this.logger.error('Test failed:', err);
    }
  }

  /**
   * Runs transactions test.
   * @method testTransactions
   */
  @Timer
  public async testTransactions() {
    const User = this.database.model('User');

    const userA = (await User.create({ username: 'Alicert', password: 'Passowrd69!' })) as any;
    const userB = (await User.create({ username: 'Bobbert', password: 'Password420!' })) as any;

    try {
      await this.database.transaction(async (t) => {
        const transactionOptions = { transaction: t };

        await userA.update({ username: 'Alice' }, transactionOptions);
        await userB.update({ username: 'Bobby' }, transactionOptions);
      });

      await userA.reload();
      await userB.reload();

      if (userA.username !== 'Alice' || userB.username !== 'Bobby') {
        throw new Error('Transaction failed');
      }

      this.logger.info('Transaction succeeded');
    } catch (err: any) {
      this.logger.error('Test failed:', err);
    }
  }
}
