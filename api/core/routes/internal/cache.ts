import Koa from 'koa';

import { SyRoutes } from '../SyRoutes';
import { CacheController } from '../../controller/internal';

/**
 * Extends the generic SyRoutes class to provide specific routing logic for handling caching within the application.
 * This class manages the API endpoints related to caching operations, such as starting, stopping, and configuring cache.
 *
 * The `CacheRoutes` class interacts with the associated `CacheController` to perform
 * the necessary operations and interactions with the caching layer.
 *
 * @extends {SyRoutes<CacheController>}
 * @see SyRoutes for the base class implementation details
 *
 * @example
 * const app = new Koa();
 * const cacheRoutes = new CacheRoutes(app);
 */
export class CacheRoutes extends SyRoutes<CacheController> {
  /**
   * Constructs a new instance of the CacheRoutes class.
   *
   * @param {Koa} app - An instance of a Koa application.
   */
  constructor(app: Koa) {
    super(new CacheController(app.context.logger), 'cache', app, 'v0.1');
  }
}
