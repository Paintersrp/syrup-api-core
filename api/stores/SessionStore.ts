import { Session } from '../core/models/general/Session';

class SessionStore {
  async get(
    key: string,
    maxAge: number | 'session' | undefined,
    data: { rolling: boolean | undefined }
  ): Promise<any> {
    console.log('Getting session:', key); // Log here
    const session = await Session.findOne({ where: { sid: key } });
    return session ? JSON.parse(session.data) : null;
  }

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

  async destroy(key: string): Promise<void> {
    await Session.destroy({ where: { sid: key } });
  }
}

export default SessionStore;
