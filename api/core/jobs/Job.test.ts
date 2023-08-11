import { Job } from './Job';
import { JobOptions } from './types';

describe('Job', () => {
  const mockTask = jest.fn().mockImplementation(async () => {
    // You can add any logic here if needed
  });
  const testCronScheduled = '*/5 * * * *';
  const jobOptions = {
    name: 'test-job',
    task: mockTask,
    schedule: testCronScheduled,
  };

  it('should create a job with correct properties', () => {
    const job = new Job(jobOptions);

    expect(job.name).toBe('test-job');
    expect(job.task).toBe(jobOptions.task);
    expect(job.schedule).toBe(testCronScheduled);
  });

  it('should throw an error if schedule is not in the correct cron format', () => {
    const job = new Job(jobOptions);

    expect(() => {
      job.schedule = 'invalid-schedule';
    }).toThrow(Error);
  });

  it('should add and remove hooks', () => {
    const job = new Job(jobOptions);
    const hook = jest.fn();

    job.addHook('onStart', hook);
    expect(job.hooks.onStart).toBe(hook);

    job.removeHook('onStart');
    expect(job.hooks.onStart).toBeUndefined();
  });

  it('should pause and resume the job', async () => {
    const job = new Job(jobOptions);

    job.pause();
    expect(job.status).toBe('paused');

    await job.resume();
    expect(job.status).toBe('completed');
  });

  it('should execute the task and update status and logs', async () => {
    const task = jest.fn();
    const job = new Job({ ...jobOptions, task });

    await job.execute();

    expect(task).toHaveBeenCalled();
    expect(job.status).toBe('completed');
  });

  it('should retry the task if it fails', async () => {
    const task = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce(undefined);
    const job = new Job({ ...jobOptions, task, maxRetries: 1 });

    await job.execute();

    expect(task).toHaveBeenCalledTimes(2);
    expect(job.retryCount).toBe(1);
    expect(job.status).toBe('completed');
  });

  describe('priority', () => {
    it('should return the priority of the job', () => {
      const jobOptions: JobOptions = {
        name: 'test-job',
        task: jest.fn(),
        schedule: '*/5 * * * *',
        priority: 10,
      };

      const job = new Job(jobOptions);

      expect(job.priority).toBe(10);
    });
  });

  it('should return the default priority if not specified in options', () => {
    const jobOptions: JobOptions = {
      name: 'test-job',
      task: jest.fn(),
      schedule: '*/5 * * * *',
    };

    const job = new Job(jobOptions);

    expect(job.priority).toBe(0);
  });
});
