import Koa from 'koa';
import { CacheController } from '../controllers';
import { SyRoutes } from '../core/routes/SyRoutes';

export class CacheRoutes extends SyRoutes<CacheController> {
  constructor(app: Koa) {
    super(new CacheController(app.context.logger), 'cache', app, 'v0.1');
  }
}
