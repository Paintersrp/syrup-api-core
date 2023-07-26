import Koa, { EventEmitter, Middleware } from 'koa';
import Router from 'koa-router';
import { Logger } from 'pino';
import { ModelStatic, Optional, Transaction } from 'sequelize';

import { ORM } from '../../settings';
import { ETag, Log, Monitor } from '../lib/decorators/controllers';
import { Retry } from '../lib/decorators/general';
import { Responses } from '../lib';
import { InternalServerError } from '../errors/server';
import {
  SyCreateMixin,
  SyDeleteMixin,
  SyReadMixin,
  SyMetaMixin,
  SyMiddlewareMixin,
  SyUpdateMixin,
} from './mixins';
import { SyControllerOptions } from './types';

/**
 * @class SyController
 * @classdesc SyController is a class responsible for handling HTTP requests and responses.
 * It includes advanced features such as input validation, transaction management, logging, rate limiting, and more.
 *
 * It's highly flexible and can be easily extended or customized for your specific needs.
 *
 * @example
 * class UserController extends SyController {
 *   constructor({options}) {
 *     super(options);
 *     // add custom logic here
 *   }
 * }
 *
 * const userController = new UserController({
 *   model: UserModel,
 *   schema: UserSchema,
 *   logger: pino(),
 * });
 *
 * userRouter.get('/users/:id', userController.read);
 */
export abstract class SyController extends EventEmitter {
  protected model: ModelStatic<any>;
  protected schema: any;
  protected logger: Logger;
  protected customMiddlewares: Middleware[];
  protected internalMethodsToBind = [
    'create',
    'read',
    'update',
    'delete',
    'all',
    'validateBody',
    'cacheEndpoint',
    'getMetadata',
    'options',
  ];

  protected declare createMixin: SyCreateMixin;
  protected declare readMixin: SyReadMixin;
  protected declare updateMixin: SyUpdateMixin;
  protected declare deleteMixin: SyDeleteMixin;
  protected declare middlewareMixin: SyMiddlewareMixin;
  protected declare metaMixin: SyMetaMixin;

  /**
   * @desc Constructs a new instance of the SyController class and initializes the Mixins which
   * provide the main functionality of the SyController. It also binds all the inherited methods
   * from SyController and the inheriting class to the respective instances.
   *
   * @param {ModelStatic<any>} options.model A Sequelize model representing the database table.
   * @param {any} options.schema - A Joi object schema used for validating request body data.
   * @param {Logger} options.logger - The instance of application logger.
   * @param {Middleware[]} [options.middlewares] - An array of custom middlewares to be used in this controller.
   */
  constructor({ model, schema, logger, middlewares = [] }: SyControllerOptions) {
    super();

    this.model = model;
    this.schema = schema;
    this.logger = logger;
    this.customMiddlewares = middlewares;

    this.setupMixins();
    this.bindMethods(this.internalMethodsToBind);
  }

  /**
   * @desc This method initializes the Mixins, which provide the main functionality
   * of the SyController. It creates instances of various Mixin classes and assigns them
   * to the corresponding properties of the SyController.
   */
  private setupMixins(): void {
    const mixinOptions = { model: this.model, logger: this.logger };

    this.createMixin = new SyCreateMixin(mixinOptions);
    this.readMixin = new SyReadMixin(mixinOptions);
    this.updateMixin = new SyUpdateMixin(mixinOptions);
    this.deleteMixin = new SyDeleteMixin(mixinOptions);
    this.metaMixin = new SyMetaMixin(mixinOptions);
    this.middlewareMixin = new SyMiddlewareMixin({ ...mixinOptions, schema: this.schema });
  }

  /**
   * Apply middleware to a specific Koa router.
   * @param {Router} router - Koa router where the middleware will be applied.
   */
  protected applyMiddleware(router: Router) {
    this.customMiddlewares.forEach((middleware) => router.use(middleware));
  }

  /**
   * @method bindMethods
   * @description This method is responsible for binding the context ('this') to the
   * methods of the inheriting class to their respective instances. This ensures that the methods
   * are always invoked with the correct 'this' value, which corresponds to the class instance they
   * are invoked on.
   */
  protected bindMethods(methodsToBind: string[]): void {
    methodsToBind.forEach((method) => {
      (this as any)[method] = (this as any)[method].bind(this);
    });
  }

  /**
   * Wraps a callback function within a database transaction.
   * If any operation within the transaction fails, all operations are rolled back.
   * The error is also emitted as an event and can be listened to.
   * @param {RouterContext} ctx - Koa RouterContext.
   * @param {Function} callback - Callback function to be executed within the transaction.
   * @return {Promise<U>} The result of the callback function execution.
   * @emits SyController#error
   */
  private async withTransaction<U>(
    ctx: Router.RouterContext,
    callback: (transaction: Transaction) => Promise<U>
  ): Promise<U> {
    let transaction: Transaction | null = null;

    try {
      transaction = await ORM.database.transaction();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(error, 'Transaction failed');
      this.emit('error', error);
      throw new InternalServerError(Responses.INTERNAL_SERVER, transaction as any, ctx.url);
    }
  }

  /**
   * Validates field objects using instance schema
   * @param fields An object of input data as fields from a request.
   */
  protected async validate(fields: Optional<any, string>) {
    return await this.schema.validate(fields, { abortEarly: false });
  }

  /**
   * Middleware to validate the request body against the defined schema.
   * @see SyMiddlewareMixin#validateBody
   */
  public async validateBody(ctx: Router.RouterContext, next: Koa.Next) {
    return await this.middlewareMixin.validateBody(ctx, next);
  }

  /**
   * Middleware to cache the response of an endpoint and serve the cached response if available.
   * @see SyMiddlewareMixin#cacheEndpoint
   */
  public async cacheEndpoint(ctx: Router.RouterContext, next: Koa.Next) {
    return await this.middlewareMixin.cacheEndpoint(ctx, next);
  }

  /**
   * Returns all instances of the model.
   * @see SyListMixin#all
   */
  @Monitor
  public async all(ctx: Router.RouterContext) {
    return this.readMixin.all(ctx);
  }

  /**
   * Returns an instance of the model.
   * @see SyListMixin#read
   */
  @Log
  @Retry()
  public async read(ctx: Router.RouterContext) {
    return this.readMixin.read(ctx);
  }

  /**
   * Creates a new instance of the model.
   * @see SyCreateMixin#create
   */
  public async create(ctx: Router.RouterContext): Promise<void> {
    return this.withTransaction(ctx, async (transaction) => {
      return this.createMixin.create(ctx, transaction);
    });
  }

  /**
   * Updates a specific instance of the model by its ID.
   * @see SyUpdateMixin#update
   */
  public async update(ctx: Router.RouterContext): Promise<void> {
    return this.withTransaction(ctx, async (transaction) => {
      return this.updateMixin.update(ctx, transaction);
    });
  }

  /**
   * Deletes a specific instance of the model by its ID.
   * @see SyDeleteMixin#delete
   */
  public async delete(ctx: Router.RouterContext): Promise<void> {
    return this.withTransaction(ctx, async (transaction) => {
      return this.deleteMixin.delete(ctx, transaction);
    });
  }

  /**
   * This method is responsible for obtaining metadata of a Sequelize model
   * @see SyMetaMixin#getMetadata
   */
  @ETag
  public async getMetadata(ctx: Router.RouterContext): Promise<void> {
    this.metaMixin.getMetadata(ctx);
  }

  /**
   * OPTIONS endpoint.
   * @param {Router.RouterContext} ctx - The Koa router context.
   * @param {() => Promise<any>} next The next middleware function.
   */
  public async options(ctx: Router.RouterContext, next: () => Promise<any>) {
    ctx.set('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    ctx.status = 200;
    ctx.body = {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    };
    await next();
  }
}
