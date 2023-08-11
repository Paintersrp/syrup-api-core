import Koa from 'koa';
import { SyRoutes } from '../SyRoutes';
import { BlacklistController } from '../../controller/internal';

/**
 * Extends the generic SyRoutes class to provide specific routing logic for handling blacklisted items.
 * This class manages the API endpoints related to blacklisting within the application,
 * such as creating, retrieving, updating, and deleting blacklist records.
 *
 * The `BlacklistRoutes` class interacts with the associated `BlacklistController` to perform
 * the necessary business logic, validations, and interactions with the data layer.
 *
 * @extends {SyRoutes<BlacklistController>}
 * @see SyRoutes for the base class implementation details
 *
 * @example
 * const app = new Koa();
 * const blacklistRoutes = new BlacklistRoutes(app);
 */
export class BlacklistRoutes extends SyRoutes<BlacklistController> {
  /**
   * Constructs a new instance of the BlacklistRoutes class.
   *
   * @param {Koa} app - An instance of a Koa application.
   *
   * @example
   * const app = new Koa();
   * const blacklistRoutes = new BlacklistRoutes(app);
   */
  constructor(app: Koa) {
    super(new BlacklistController(app.context.logger), 'blacklist', app, 'v0.1');
  }
}
