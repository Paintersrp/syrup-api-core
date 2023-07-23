import { Logger } from 'pino';

import { SyController } from '../core/controller/SyController';
import { Cache } from '../models/cache';
import { CacheSchema } from '../schemas';

export class CacheController extends SyController {
  /**
   * Creates an instance of the Cache Controller.
   * @param {Logger} logger The application logger instance.
   */
  constructor(logger: Logger) {
    super({ model: Cache, schema: CacheSchema, logger });
  }
}
