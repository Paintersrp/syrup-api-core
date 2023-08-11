import Koa from 'koa';
import session from 'koa-session';

import { SessionStore } from './SessionStore';

/**
 * Class to manage sessions within a Koa application.
 */
export class SessionManager {
  /**
   * Constructor for the SessionManager class.
   * @param {Koa} app - The Koa application instance.
   */
  constructor(app: Koa) {
    this.initializeSessions(app);
  }

  /**
   * Configure and initialize sessions.
   * @param {Koa} app - The Koa application instance.
   * @public
   */
  public initializeSessions(app: Koa) {
    const SESSIONS_CONFIG = {
      key: 'koa.sess',
      maxAge: 86400000,
      autoCommit: true,
      overwrite: true,
      httpOnly: true,
      signed: true,
      store: new SessionStore(),
    };

    app.keys = ['some secret'];
    app.use(session(SESSIONS_CONFIG, app));
  }
}
