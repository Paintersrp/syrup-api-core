import compose, { Middleware } from 'koa-compose';
import { Configuration, MaintenanceConfig } from './types';
import { RouteConstructor } from '../../server/managers/routes/types';
import {
  AuthConfig,
  CacheConfig,
  DatabaseConfig,
  EmailConfig,
  JobConfig,
  LoggerConfig,
  LoggerOptions,
} from '../../../settings/types';

export class SyrupConfigBuilder {
  private config: Partial<Configuration> = {};

  debug(value: boolean): SyrupConfigBuilder {
    this.config.DEBUG = value;
    return this;
  }

  secretKey(value: string): SyrupConfigBuilder {
    this.config.SECRET_KEY = value;
    return this;
  }

  currentVersion(value: string): SyrupConfigBuilder {
    this.config.CURRENT_VERSION = value;
    return this;
  }

  database(value: DatabaseConfig): SyrupConfigBuilder {
    this.config.DATABASES = { default: value };
    return this;
  }

  email(value: EmailConfig): SyrupConfigBuilder {
    this.config.EMAIL = value;
    return this;
  }

  cache(value: CacheConfig): SyrupConfigBuilder {
    this.config.CACHE = value;
    return this;
  }

  loggers(value: { [key: string]: LoggerOptions }): SyrupConfigBuilder {
    this.config.LOGGERS = value;
    return this;
  }

  maintenance(value: MaintenanceConfig): SyrupConfigBuilder {
    this.config.MAINTENANCE = value;
    return this;
  }

  middlewares(value: Middleware<any>[]): SyrupConfigBuilder {
    this.config.MIDDLEWARES = compose(value);
    return this;
  }

  routes(value: RouteConstructor[]): SyrupConfigBuilder {
    this.config.ROUTES = value;
    return this;
  }

  auth(value: AuthConfig): SyrupConfigBuilder {
    this.config.AUTH = value;
    return this;
  }

  jobs(value: JobConfig): SyrupConfigBuilder {
    this.config.JOBS = value;
    return this;
  }

  build(): Configuration {
    return this.config as Configuration;
  }
}
