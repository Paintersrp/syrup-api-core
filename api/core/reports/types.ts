import { JobHooks } from '../jobs/types';

export interface ReportProfile {
  generator: any;
  schedule: string;
  name: string;
  hooks?: JobHooks;
}
