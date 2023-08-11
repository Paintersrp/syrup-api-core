import { Logger } from 'pino';
import { SyController } from '../SyController';
import { Blacklist } from '../../models/auth';
import { BlacklistSchema } from '../../schemas';

/**
 * @class BlacklistController
 *
 * @classdesc The BlacklistController class extends the SyController class to handle
 * HTTP requests related to the Blacklist model. It uses the provided Sequelize model and
 * Yup schema to interact with the blacklist database table and validates the request data.
 *
 * In addition to the common functionality provided by SyController, specific logic
 * related to blacklists can be added to this class.
 *
 * @example
 * const blacklistController = new BlacklistController(pino());
 * blacklistRouter.post('/blacklist/add', blacklistController.create);
 * blacklistRouter.get('/blacklist/:id', blacklistController.read);
 *
 * @extends {SyController}
 */
export class BlacklistController extends SyController {
  /**
   * @desc Constructs a new instance of the BlacklistController class, initializes it with the
   * Blacklist model, BlacklistSchema for validation, and the provided logger instance.
   *
   * @param {Logger} logger - The instance of application logger to be used by this controller.
   */
  constructor(logger: Logger) {
    super({ model: Blacklist, schema: BlacklistSchema, logger });
  }
}
