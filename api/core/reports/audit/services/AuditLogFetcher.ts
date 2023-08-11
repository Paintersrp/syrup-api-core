import { Audit } from '../../../models/logging/Audit';

const BATCH_SIZE = 1000;
const AUDIT_LOG_ATTRIBUTES = ['action', 'username', 'model', 'beforeData', 'afterData'];

export class AuditLogFetcher {
  /**
   * Fetches a batch of logs from the database.
   * @returns A batch of logs.
   */
  public async fetchBatch(page: number): Promise<Audit[]> {
    try {
      return await Audit.findAll({
        limit: BATCH_SIZE,
        offset: BATCH_SIZE * (page - 1),
        attributes: AUDIT_LOG_ATTRIBUTES,
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  }
}
