import Koa from 'koa';
import Router from 'koa-router';

import { LifecycleManager } from '../lifecycle/LifecycleManager';

import { RouteConstructor } from './types';
import { UserRoutes } from '../../../features/user';
import { ProfileRoutes } from '../../../features/profile';
import { BlacklistRoutes } from '../../../features/blacklist';
import { CacheRoutes } from '../../../features/cache';

/**
 * Class responsible for managing and initializing routes within a Koa application.
 */
export class RouteManager {
  /**
   * An array containing the internal routes of the application.
   */
  protected internalRoutes: RouteConstructor[] = [
    UserRoutes,
    ProfileRoutes,
    BlacklistRoutes,
    CacheRoutes,
  ];

  /**
   * Constructor for the RouteManager class.
   * Initializes and registers application and management routes.
   * @param {Koa} app - The Koa application instance.
   * @param {Router} router - The Koa router instance.
   * @param {LifecycleManager} lifecycleManager - The lifecycle manager instance.
   * @param {RouteConstructor[]} [routes] - Optional external routes to register.
   */
  constructor(
    app: Koa,
    router: Router,
    lifecycleManager: LifecycleManager,
    routes?: RouteConstructor[]
  ) {
    this.initializeRoutes(app, routes);
    this.initializeManagementRoutes(app, router, lifecycleManager);
  }

  /**
   * Registers application routes if provided, including internal and external routes.
   * @param {Koa} app - The Koa application instance.
   * @param {RouteConstructor[]} [routes] - Optional external routes to register.
   * @public
   */
  public initializeRoutes(app: Koa, routes?: RouteConstructor[]) {
    if (routes) {
      const appRoutes = [...this.internalRoutes, ...routes];

      appRoutes.forEach((RouteSet) => {
        new RouteSet(app);
      });
    } else {
      this.internalRoutes.forEach((RouteSet) => {
        new RouteSet(app);
      });
    }
  }

  /**
   * Registers server management routes such as start and stop, and applies middleware for admin access.
   * @param {Koa} app - The Koa application instance.
   * @param {Router} router - The Koa router instance.
   * @param {LifecycleManager} lifecycleManager - The lifecycle manager instance.
   * @public
   */
  public initializeManagementRoutes(app: Koa, router: Router, lifecycleManager: LifecycleManager) {
    router.get(`/sys/start`, this.checkAdminRole(), lifecycleManager.start.bind(this));
    router.get(`/sys/stop`, this.checkAdminRole(), lifecycleManager.gracefulShutdown.bind(this));

    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  /**
   * Middleware function for checking admin role.
   * Allows access to management routes for users with 'admin' or 'superadmin' roles.
   * @returns {Koa.Middleware} The middleware function.
   * @private
   */
  private checkAdminRole(): Koa.Middleware {
    return async function (ctx: Koa.Context, next: Koa.Next) {
      if (
        ctx.session &&
        ctx.session.user &&
        (ctx.session.user.role === 'admin' || ctx.session.user.role === 'superadmin')
      ) {
        await next();
      } else {
        ctx.status = 403;
        ctx.body = 'Forbidden: You do not have the necessary access rights.';
      }
    };
  }
}
