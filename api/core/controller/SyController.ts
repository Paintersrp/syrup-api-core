import Koa, { EventEmitter, Middleware } from 'koa';
import Router from 'koa-router';
import { Logger } from 'pino';
import { Model, ModelStatic, Optional } from 'sequelize';
import * as Yup from 'yup';

import { ETag, Monitor } from '../lib/decorators/controllers';
import {
  SyCreateMixin,
  SyDeleteMixin,
  SyReadMixin,
  SyMetaMixin,
  SyMiddlewareMixin,
  SyUpdateMixin,
} from './mixins';
import { ControllerMixins, SyControllerOptions } from './types';
import { TransactionManager } from '../mixins/transactions';
import { InternalMethodsToBind } from './enums';

/**
 * @class SyController
 *
 * @classdesc SyController is a highly flexible and feature-rich class responsible for handling
 * HTTP requests and responses. Its responsibilities include:
 *
 * 1. Database Interaction: It uses a Sequelize model to interact with the database. The specifics
 * of this interaction will depend on the model passed in during instantiation.
 *
 * 2. Request Validation: It validates request data using a Yup schema that's also passed in during
 * instantiation.
 *
 * 3. Transaction Management: It manages database transactions using a TransactionManager. This ensures
 * that database operations are atomic.
 *
 * 4. Logging: It logs information about its operations. The specifics of what it logs and how would
 * depend on the Logger instance passed in during instantiation.
 *
 * 5. Middleware Application: It allows for the application of custom middleware for advanced
 * request/response handling.
 *
 * 6. Route Handling: It provides methods for handling various HTTP methods like GET, POST, PUT,
 * DELETE, and OPTIONS. It can also provide metadata about the Sequelize model.
 *
 * The class can be extended to customize its functionality for specific needs.
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
  protected model: ModelStatic<Model>;
  protected schema: Yup.AnyObjectSchema;
  protected logger: Logger;
  protected transactionManager: TransactionManager;
  protected customMiddlewares: Middleware[];
  protected mixins!: ControllerMixins;

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
    this.transactionManager = new TransactionManager(this.logger);
    this.customMiddlewares = middlewares;

    this.setupMixins();
    this.bindMethods(Object.values(InternalMethodsToBind));
  }

  /**
   * @desc This method initializes the Mixins, which provide the main functionality
   * of the SyController. It creates instances of various Mixin classes and assigns them
   * to the corresponding properties of the SyController.
   */
  private setupMixins(): void {
    const mixinOptions = { model: this.model, logger: this.logger };

    this.mixins = {
      create: new SyCreateMixin(mixinOptions),
      read: new SyReadMixin(mixinOptions),
      update: new SyUpdateMixin(mixinOptions),
      delete: new SyDeleteMixin(mixinOptions),
      meta: new SyMetaMixin(mixinOptions),
      middleware: new SyMiddlewareMixin({ ...mixinOptions, schema: this.schema }),
    };
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
   * Validates field objects using instance schema
   * @param fields An object of input data as fields from a request.
   */
  protected async validate(fields: Optional<any, string>) {
    return await this.schema.validate(fields, { abortEarly: false });
  }

  /**
   * Middleware to cache the response of an endpoint and serve the cached response if available.
   * @see SyMiddlewareMixin#cacheEndpoint
   */
  public async cacheEndpoint(ctx: Router.RouterContext, next: Koa.Next) {
    return await this.mixins.middleware.cacheEndpoint(ctx, next);
  }

  /**
   * OPTIONS endpoint.
   * @see SyMiddlewareMixin#options
   */
  public async options(ctx: Router.RouterContext, next: () => Promise<any>) {
    return await this.mixins.middleware.options(ctx, next);
  }

  /**
   * Middleware to validate the request body against the defined schema.
   * @see SyMiddlewareMixin#validateBody
   */
  public async validateBody(ctx: Router.RouterContext, next: Koa.Next) {
    return await this.mixins.middleware.validateBody(ctx, next);
  }

  /**
   * Returns all instances of the model.
   * @see SyReadMixin#all
   */
  @Monitor
  public async all(ctx: Router.RouterContext) {
    return this.mixins.read.all(ctx);
  }

  /**
   * Returns an instance of the model.
   * @see SyReadMixin#read
   */
  public async read(ctx: Router.RouterContext) {
    return this.mixins.read.read(ctx);
  }

  /**
   * Creates a new instance of the model.
   * @see SyCreateMixin#create
   */
  public async create(ctx: Router.RouterContext): Promise<void> {
    return this.transactionManager.performTransaction(ctx, 'create', this.mixins.create);
  }

  /**
   * Updates a specific instance of the model by its ID.
   * @see SyUpdateMixin#update
   */
  public async update(ctx: Router.RouterContext): Promise<void> {
    return this.transactionManager.performTransaction(ctx, 'update', this.mixins.update);
  }

  /**
   * Deletes a specific instance of the model by its ID.
   * @see SyDeleteMixin#delete
   */
  public async delete(ctx: Router.RouterContext): Promise<void> {
    return this.transactionManager.performTransaction(ctx, 'delete', this.mixins.delete);
  }

  /**
   * This method is responsible for obtaining metadata of a Sequelize model
   * @see SyMetaMixin#getMetadata
   */
  @ETag
  public async getMetadata(ctx: Router.RouterContext): Promise<void> {
    this.mixins.meta.getMetadata(ctx);
  }
}
