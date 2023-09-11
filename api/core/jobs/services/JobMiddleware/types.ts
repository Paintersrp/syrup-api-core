import { Job } from '../../Job';

export type JobMiddlewareType = (job: Job, next: () => Promise<void>) => Promise<void>;
