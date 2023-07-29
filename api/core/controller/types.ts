import { Middleware } from 'koa';
import { Logger } from 'pino';
import { Model, ModelStatic } from 'sequelize';
import {
  SyCreateMixin,
  SyDeleteMixin,
  SyMetaMixin,
  SyMiddlewareMixin,
  SyReadMixin,
  SyUpdateMixin,
} from './mixins';

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
  price_greater_than?: number;

  fields?: string; // set attribute fields to return by query
}

export interface ControllerMixins {
  create: SyCreateMixin;
  read: SyReadMixin;
  update: SyUpdateMixin;
  delete: SyDeleteMixin;
  meta: SyMetaMixin;
  middleware: SyMiddlewareMixin;
}
