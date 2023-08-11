import path from 'path';
import fs from 'fs-extra';
import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';

/**
 * Class responsible for setting up Server-Side Rendering (SSR) in a Koa application.
 */
export class SSRManager {
  /**
   * Constructor for the SSRManager class.
   * Initializes SSR for the given Koa application and router.
   * @param {Koa} app - The Koa application instance.
   * @param {Router} router - The Koa router instance.
   * @param {string} [distPath] - Optional distribution path where the SSR files are located.
   */
  constructor(app: Koa, router: Router, distPath?: string) {
    this.initializeSSR(app, router, distPath);
  }

  /**
   * Sets up SSR if a distribution path is provided.
   * Serves static files from the distribution path and sets up a catch-all route
   * to handle all requests by rendering the index.html file.
   * @param {Koa} app - The Koa application instance.
   * @param {Router} router - The Koa router instance.
   * @param {string} [distPath] - Optional distribution path where the SSR files are located.
   * @public
   */
  public initializeSSR(app: Koa, router: Router, distPath?: string) {
    if (distPath) {
      app.use(serve(distPath));

      router.get('*', async (ctx) => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(path.join(distPath, 'index.html'));
      });

      app.use(router.routes()).use(router.allowedMethods());
    }
  }
}
