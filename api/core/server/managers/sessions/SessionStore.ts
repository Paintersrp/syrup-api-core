import { Session } from '../../../models/general';

/**
 * Class to manage sessions within the application.
 * Provides methods for getting, setting, and destroying sessions.
 */
export class SessionStore {
  /**
   * Retrieves the session data associated with a given key.
   * @param {string} key - The key identifying the session.
   * @param {number | 'session' | undefined} maxAge - Max age for the session.
   * @param {{ rolling: boolean | undefined }} data - Additional session information.
   * @returns {Promise<any>} A Promise resolving to the session data or null if not found.
   */
  async get(
    key: string,
    maxAge: number | 'session' | undefined,
    data: { rolling: boolean | undefined }
  ): Promise<any> {
    const session = await Session.findOne({ where: { sid: key } });
    return session ? JSON.parse(session.data) : null;
  }

  /**
   * Sets or updates the session data associated with a given key.
   * @param {string} key - The key identifying the session.
   * @param {any} sess - The session data to be stored.
   * @param {number | 'session' | undefined} maxAge - Max age for the session.
   * @param {{ rolling: boolean | undefined }} data - Additional session information.
   * @returns {Promise<string>} A Promise resolving to the key of the session.
   */
  async set(
    key: string,
    sess: any,
    maxAge?: number | 'session',
    data?: { rolling: boolean | undefined }
  ): Promise<string> {
    const serializedSess = JSON.stringify(sess);
    const expiresAt = typeof maxAge === 'number' ? new Date(Date.now() + maxAge) : undefined;

    const existingSession = await Session.findOne({ where: { sid: key } });
    try {
      if (existingSession) {
        await existingSession.update({ data: serializedSess, expiresAt });
      } else {
        await Session.create({ sid: key, data: serializedSess, expiresAt });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

    return key;
  }

  /**
   * Destroys the session associated with a given key.
   * @param {string} key - The key identifying the session to be destroyed.
   * @returns {Promise<void>} A Promise that resolves when the operation is complete.
   */
  async destroy(key: string): Promise<void> {
    await Session.destroy({ where: { sid: key } });
  }
}
