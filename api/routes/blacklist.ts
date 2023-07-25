import Koa from 'koa';
import { BlacklistController } from '../controllers';
import { SyRoutes } from '../core/routes/SyRoutes';

export class BlacklistRoutes extends SyRoutes<BlacklistController> {
  constructor(app: Koa) {
    super(new BlacklistController(app.context.logger), 'blacklist', app, 'v0.1');
  }
}
