import { Logger } from 'pino';

import { SyController } from '../core/controller/SyController';
import { Blacklist } from '../models/blacklist';
import { BlacklistSchema } from '../schemas/blacklist';

export class BlacklistController extends SyController {
  /**
   * Creates an instance of the Blacklist Controller.
   * @param {Logger} logger The application logger instance.
   */
  constructor(logger: Logger) {
    super({ model: Blacklist, schema: BlacklistSchema, logger });
  }
}
