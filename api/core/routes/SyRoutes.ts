import Koa from 'koa';
import Router from 'koa-router';

import { Logger } from 'pino';
import { SyController } from '../controller/SyController';

/**
 *
 * Provides a reusable generic class to define routes and endpoints for a specific subclass of SyController.
 * @template T - The subclass of SyController that defines the model and controller logic.
 *
 * @example
 * // Creating routes for the User model
 * const userController = new UserController(app);
 * const userRoutes = new SyRoutes<UserController>(userController, 'users', app);
 *
 * // The following endpoints will be available for the 'users' route:
 * // - POST /users: Creates a new user record in the database. Requires validation of the request body.
 * // - GET /users/:id: Retrieves a specific user record from the database by ID.
 * // - PUT /users/:id: Updates a specific user record in the database by ID. Requires validation of the request body.
 * // - DELETE /users/:id: Deletes a specific user record from the database by ID.
 * // - GET /users: Retrieves all user records from the database with optional pagination, sorting, and filtering.
 */
export class SyRoutes<T extends SyController> {
  controller: T;
  router: Router;
  routeName: string;
  logger: Logger;

  /**
   * Constructs a new instance of the Routes class.
   * @param controller A Sequelize model representing the database table.
   * @param app An instance of Koa application.
   */
  constructor(controller: T, routeName: string, app: Koa) {
    this.controller = controller;
    this.router = new Router();
    this.routeName = routeName;
    this.logger = app.context.logger;

    this.initModelRoutes();
    this.addRoutesToApp(app);
  }

  /**
   * Add initial routes and endpoints to application
   */
  protected initModelRoutes() {
    this.router.post(`/${this.routeName}`, this.controller.validateBody, this.controller.create);
    this.router.get(`/${this.routeName}/:id`, this.controller.read);
    this.router.put(`/${this.routeName}/:id`, this.controller.validateBody, this.controller.update);
    this.router.delete(`/${this.routeName}/:id`, this.controller.delete);
    this.router.get(`/${this.routeName}`, this.controller.cacheEndpoint, this.controller.all);
    this.router.get(`/meta/${this.routeName}`, this.controller.getMetadata);
  }

  /**
   * Adds the router routes and allowed methods to the Koa application.
   * @param app The Koa application.
   */
  public addRoutesToApp(app: Koa) {
    app.use(this.router.routes());
    app.use(this.router.allowedMethods());
  }

  /**
   * @returns The router instance.
   */
  public getRouter() {
    return this.router;
  }

  /**
   * Sets a new Sequelize model for the instance.
   * @param controller A Sequelize model representing the database table.
   */
  public setController(controller: T): void {
    this.controller = controller;
  }
}
