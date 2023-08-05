import { JobHooks } from '../../mixins/job/types';

export interface ReportProfile {
  generator: any;
  schedule: string;
  name: string;
  hooks?: JobHooks;
}
