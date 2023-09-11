import Koa from 'koa';
import { SyRoutes } from '../../routes';
import { ProfileController } from './controller';

/**
 * Extends the generic SyRoutes class to provide specific routing logic for handling user profiles within the application.
 * This class manages the API endpoints related to profile operations, such as retrieving and updating user profiles.
 *
 * The `ProfileRoutes` class interacts with the associated `ProfileController` to perform
 * the necessary business logic and interactions with the data layer.
 *
 * @extends {SyRoutes<ProfileController>}
 * @see SyRoutes for the base class implementation details
 *
 * @example
 * const app = new Koa();
 * const profileRoutes = new ProfileRoutes(app);
 */
export class ProfileRoutes extends SyRoutes<ProfileController> {
  /**
   * Constructs a new instance of the ProfileRoutes class.
   *
   * @param {Koa} app - An instance of a Koa application.
   */
  constructor(app: Koa) {
    super(new ProfileController(app.context.logger), 'profile', app, 'v0.1');
  }
}
