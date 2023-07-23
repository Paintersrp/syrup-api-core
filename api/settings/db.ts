import { Dialect } from 'sequelize';
import { SyDatabase } from '../core/database/SyDatabase';
import { logger, queriesLogger } from './loggers';

export const DB_PATH = '../dev.sqlite3';
export const DB_TYPE = 'sqlite' as Dialect;
export const DB_CONFIG = {
  dialect: DB_TYPE,
  storage: DB_PATH,
  logging: false,
};

export const ORM = new SyDatabase(DB_CONFIG, logger, queriesLogger);
