import { ComposedMiddleware } from 'koa-compose';
import { RouteConstructor } from '../../server/managers/routes/types';
import {
  AuthConfig,
  CacheConfig,
  DatabaseConfig,
  EmailConfig,
  JobConfig,
  LoggerOptions,
} from '../../../settings/types';

export type MaintenanceConfig = {
  MODE: boolean;
  STATUS: number;
  MESSAGE: string;
  END_ESTIMATE?: string; // Optional end time for maintenance mode
};

export type Configuration = {
  DEBUG: boolean;
  SECRET_KEY: string;
  CURRENT_VERSION: string;
  DATABASES: { default: DatabaseConfig };
  EMAIL: EmailConfig;
  CACHE: CacheConfig;
  LOGGERS: { [key: string]: LoggerOptions };
  MAINTENANCE: MaintenanceConfig;
  MIDDLEWARES: ComposedMiddleware<any>;
  ROUTES: RouteConstructor[];
  AUTH: AuthConfig;
  JOBS: JobConfig;
};
