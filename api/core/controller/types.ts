import { Middleware } from 'koa';
import { Logger } from 'pino';
import { Model, ModelStatic } from 'sequelize';

export interface SyControllerOptions {
  model: ModelStatic<any>;
  schema: any;
  logger: Logger;
  middlewares?: Middleware[];
}

export type ControllerMixinOptions = { model: ModelStatic<Model>; logger: Logger };
export type ControllerMixinMiddlewareOptions = ControllerMixinOptions & { schema: any };

export interface ControllerQueryOptions {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: string;
  column?: string;
}
