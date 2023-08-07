import Koa from 'koa';
import Router from 'koa-router';

import { Logger } from 'pino';
import { SyController } from '../controller/SyController';
import { StackedRouter } from './types';

/**
 * Provides a reusable generic class to define routes and endpoints for a specific subclass of SyController.
 *
 * @template T - A subclass of SyController defining the model and associated controller logic.
 *
 * @example
 * // To create routes for User model
 * const userController = new UserController(app);
 * const userRoutes = new SyRoutes<UserController>(userController, 'users', app);
 *
 * // Available endpoints for 'users' route:
 * // - POST /users: Creates a new user record. Requires request body validation.
 * // - GET /users/:id: Retrieves a specific user record by ID.
 * // - PUT /users/:id: Updates a specific user record by ID. Requires request body validation.
 * // - PATCH /users/:id: Updates a specific user record by ID. Requires request body validation.
 * // - DELETE /users/:id: Deletes a specific user record by ID.
 * // - GET /users: Retrieves all user records. Supports pagination, sorting, and filtering.
 * // - GET meta/users: Retrieves metadata about the user model
 * // - OPTIONS /users: Retrieves available endpoint option methods
 */
export class SyRoutes<T extends SyController> {
  controller: T;
  router: StackedRouter;
  routeName: string;
  logger: Logger;
  version: string;

  /**
   * Constructs a new instance of the Routes class.
   *
   * @param controller - A Sequelize model representing a database table.
   * @param routeName - Name of the route.
   * @param app - An instance of a Koa application.
   * @param version - Optional version of the API.
   */
  constructor(controller: T, routeName: string, app: Koa, version?: string | number | 'v1') {
    this.controller = controller;
    this.router = new Router() as StackedRouter;
    this.routeName = routeName;
    this.logger = app.context.logger;
    this.version = `${routeName}-${version}`;

    this.initModelRoutes(); // Initialize all model-related routes.
    this.addRoutesToApp(app); // Add these routes to Koa application.
  }

  /**
   * Initializes all the routes related to the model
   */
  protected initModelRoutes() {
    const { controller, router, routeName } = this;

    router
      .post(`/${routeName}`, controller.validateBody, controller.create)
      .get(`/${routeName}/:id`, controller.read)
      // .get(`/${routeName}/:id`, controller.cacheEndpoint, controller.read)
      .put(`/${routeName}/:id`, controller.validateBody, controller.update)
      .patch(`/${routeName}/:id`, controller.validateBody, controller.update)
      .delete(`/${routeName}/:id`, controller.delete)
      .get(`/${routeName}`, controller.all)
      // .get(`/${routeName}`, controller.cacheEndpoint, controller.all)
      .get(`/meta/${routeName}`, controller.cacheEndpoint, controller.getMetadata)
      .options(`/${routeName}`, controller.options);
  }

  /**
   * Adds the router routes and allowed methods to the Koa application.
   *
   * @param app - The Koa application instance.
   */
  public addRoutesToApp(app: Koa) {
    const { router } = this;

    app.use(router.routes()); // Add routes to the application.
    app.use(router.allowedMethods()); // Add allowed methods to the application.
  }

  /**
   * Returns the router instance.
   *
   * @returns {Router} The router instance.
   */
  public getRouter(): Router {
    return this.router;
  }

  /**
   * Sets a new Sequelize model for the instance.
   * @param controller A Sequelize model representing the database table.
   */
  public getController(): T {
    return this.controller;
  }
}
