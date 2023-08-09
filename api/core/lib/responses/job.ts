export const JobResponses = {
  INVALID_CRON: 'Invalid cron format',
  JOB_NOT_FOUND: (name: string) => `Job with name ${name} does not exist.`,
  JOB_DUPLICATION: (name: string) => `Job with name ${name} already exists.`,
};
