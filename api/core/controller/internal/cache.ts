import { Logger } from 'pino';

import { SyController } from '../SyController';
import { CacheSchema } from '../../schemas';
import { Cache } from '../../models/general';

/**
 * @class CacheController
 *
 * @classdesc The CacheController class extends the SyController class to handle
 * HTTP requests related to the Cache model. It uses the provided Sequelize model and
 * Yup schema to interact with the cache database table and validates the request data.
 *
 * In addition to the common functionality provided by SyController, specific logic
 * related to cache can be added to this class.
 *
 * @example
 * const cacheController = new CacheController(pino());
 * cacheRouter.post('/cache/add', cacheController.create);
 * cacheRouter.get('/cache/:id', cacheController.read);
 *
 * @extends {SyController}
 */
export class CacheController extends SyController {
  /**
   * @desc Constructs a new instance of the CacheController class, initializes it with the
   * Cache model, CacheSchema for validation, and the provided logger instance.
   *
   * @param {Logger} logger - The instance of application logger to be used by this controller.
   */
  constructor(logger: Logger) {
    super({ model: Cache, schema: CacheSchema, logger });
  }
}
