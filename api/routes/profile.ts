import Koa from 'koa';
import { ProfileController } from '../controllers';
import { SyRoutes } from '../core/routes/SyRoutes';

export class ProfileRoutes extends SyRoutes<ProfileController> {
  constructor(app: Koa) {
    super(new ProfileController(app.context.logger), 'profile', app);
  }
}
