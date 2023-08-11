import Koa from 'koa';
import { UserController } from '../../controller/internal';
import { SyRoutes } from '../SyRoutes';

/**
 * Extends the generic SyRoutes class to provide specific routing logic for handling users within the application.
 * This class manages the API endpoints related to user operations, such as registration, login, logout, and token refresh.
 *
 * The `UserRoutes` class interacts with the associated `UserController` to perform
 * the necessary authentication, authorization, and data-related operations.
 *
 * @extends {SyRoutes<UserController>}
 * @see SyRoutes for the base class implementation details
 *
 * @example
 * const app = new Koa();
 * const userRoutes = new UserRoutes(app);
 */
export class UserRoutes extends SyRoutes<UserController> {
  /**
   * Constructs a new instance of the UserRoutes class.
   * Initializes additional specific user-related routes such as registration, login, logout, and token refresh.
   *
   * @param {Koa} app - An instance of a Koa application.
   */
  constructor(app: Koa) {
    super(new UserController(app.context.logger), 'users', app, 'v0.1');

    this.router.post(`/register`, this.controller.validateUserBody, this.controller.register);
    this.router.post(`/login`, this.controller.login);
    this.router.get(`/logout`, this.controller.logout);
    this.router.post(`/refresh-token`, this.controller.refresh_token);

    this.addRoutesToApp(app);
  }
}
