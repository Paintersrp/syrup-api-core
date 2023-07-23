import { Logger } from 'pino';

import { SyController } from '../core/controller/SyController';
import { Profile } from '../models/profile';
import { ProfileSchema } from '../schemas';

export class ProfileController extends SyController {
  /**
   * Creates an instance of the Profile Controller.
   * @param {Logger} logger The application logger instance.
   */
  constructor(logger: Logger) {
    super({ model: Profile, schema: ProfileSchema, logger });
  }
}
