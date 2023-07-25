import Koa from 'koa';
import { UserController } from '../controllers';
import { SyRoutes } from '../core/routes/SyRoutes';

export class UserRoutes extends SyRoutes<UserController> {
  constructor(app: Koa) {
    super(new UserController(app.context.logger), 'users', app, 'v0.1');

    this.router.post(`/register`, this.controller.validateUserBody, this.controller.register);
    this.router.post(`/login`, this.controller.validateUserBody, this.controller.login);
    this.router.get(`/logout`, this.controller.logout);
    this.router.post(`/refresh-token`, this.controller.refresh_token);

    this.addRoutesToApp(app);
  }
}
