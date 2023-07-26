import { Dialect } from 'sequelize';
import { SyDatabase } from '../core/database/SyDatabase';
import { logger, queriesLogger } from './loggers';

export const DB_PATH = '../dev.sqlite3';
export const DB_TYPE = 'sqlite' as Dialect;
export const DB_CONFIG = {
  dialect: DB_TYPE,
  storage: DB_PATH,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000,
    evict: 5000,
  },
  dialectOptions: {
    connectTimeout: 60000,
  },
  retry: {
    max: 5,
    backoffBase: 100,
    backoffExponent: 1.1,
  },
};

export const ORM = new SyDatabase(DB_CONFIG, logger);
