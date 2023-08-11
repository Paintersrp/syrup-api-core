import { Logger } from 'pino';
import { ProfileSchema } from '../../schemas';
import { SyController } from '../SyController';
import { Profile } from '../../models/auth';

/**
 * @class ProfileController
 *
 * @classdesc The ProfileController class extends the SyController class to handle
 * HTTP requests related to the Profile model. It uses the provided Sequelize model and
 * Yup schema to interact with the profile database table and validates the request data.
 *
 * In addition to the common functionality provided by SyController, specific logic
 * related to user profiles can be added to this class.
 *
 * @example
 * const profileController = new ProfileController(pino());
 * profileRouter.post('/profile/add', profileController.create);
 * profileRouter.get('/profile/:id', profileController.read);
 *
 * @extends {SyController}
 */
export class ProfileController extends SyController {
  /**
   * @desc Constructs a new instance of the ProfileController class, initializes it with the
   * Profile model, ProfileSchema for validation, and the provided logger instance.
   *
   * @param {Logger} logger - The instance of application logger to be used by this controller.
   */
  constructor(logger: Logger) {
    super({ model: Profile, schema: ProfileSchema, logger });
  }
}
