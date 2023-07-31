import { Dialect } from 'sequelize';
import { SyDatabase } from '../../core/database/SyDatabase';
import { DATABASE } from '../database';

import { APP_LOGGER } from './logger';

/**
 * @description Syrup Internal Database Configuration
 *
 * Before making adjustments to these internal configurations be sure to review the SyDatabase Class. For most cases, adjustments to the available user configuration options should suffice.
 */
export const DB_CONFIG = {
  dialect: DATABASE.TYPE as Dialect,
  storage: DATABASE.PATH,
  logging: false,
  pool: DATABASE.POOL,
  dialectOptions: DATABASE.DIALECT_OPTIONS,
  retry: DATABASE.RETRY,
};

export const ORM = new SyDatabase(DB_CONFIG, APP_LOGGER);
