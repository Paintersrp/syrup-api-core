import { Dialect } from 'sequelize';
import { SyDatabase } from '../../core/database/SyDatabase';

import { APP_LOGGER } from './logger';
import { SETTINGS } from '../settings';

/**
 * @description Syrup Internal Database Configuration
 *
 * Before making adjustments to these internal configurations be sure to review the SyDatabase Class. For most cases, adjustments to the available user configuration options should suffice.
 */
export const DB_CONFIG = {
  dialect: SETTINGS.DATABASES.DEFAULT.TYPE as Dialect,
  storage: SETTINGS.DATABASES.DEFAULT.PATH,
  logging: false,
  pool: SETTINGS.DATABASES.DEFAULT.POOL,
  dialectOptions: SETTINGS.DATABASES.DEFAULT.DIALECT_OPTIONS,
  retry: SETTINGS.DATABASES.DEFAULT.RETRY,
};

export const ORM = new SyDatabase(DB_CONFIG, APP_LOGGER);
