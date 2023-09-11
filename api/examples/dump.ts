import { ModelController } from '../core/controller/model/ModelController';
import { Emitter } from '../core/emitter';

const emitter = new Emitter();

emitter.on('testEvent', () => {
  console.log('Default priority (0) listener');
});

emitter.on(
  'testEvent',
  () => {
    console.log('Higher priority (5) listener');
  },
  5
);

emitter.on(
  'testEvent',
  () => {
    console.log('Lower priority (-5) listener');
  },
  -5,
  { source: 'core' }
);

emitter.emit('testEvent');

//

import madge from 'madge';
import { User } from '../core/features/user';
import { Profile } from '../core/features/profile';

madge('../core').then((res) => {
  console.log('Starting');
  res
    .image('graph.png')
    .then(() => {
      console.log('Image was saved to graph.png');
    })
    .catch((error) => {
      console.log('Error saving image:', error);
    });
});

//

async function testModelController() {
  const userController = ModelController.of(User);

  const newUser = await userController.create({
    username: 'john_doe',
    password: 'yeetboi6969',
  });

  const users = await userController
    .where({ username: 'Johnny' })
    .include([{ model: Profile }])
    .orderBy([['createdAt', 'DESC']])
    .limit(10)
    .find();

  const page = 4;
  const pageSize = 10;
  const paginatedUsers = await userController
    .where({ username: 'Johnny' })
    .paginate(page, pageSize)
    .find();
}

//

import { JobScheduler } from '../core/jobs/services/JobScheduler/JobScheduler';
import { JobMiddlewareType } from '../core/jobs/services/JobMiddleware/types';
import { JobBuilder } from '../core/jobs/services/JobBuilder/JobBuilder';

async function testTask() {
  console.log('Ran');
}

const scheduleOptions = new JobScheduler()
  .weekly('mon')
  .at('09:00')
  .inTimeZone('America/New_York')
  .excludingWeekends()
  .toConfig();

const loggingMiddleware: JobMiddlewareType = async (job, next) => {
  console.log(`Starting job ${job.name} at ${new Date()}`);
  await next();
  console.log(`Finished job ${job.name} at ${new Date()}`);
};

const job = new JobBuilder()
  .withName('MyJob')
  .withTask(testTask)
  .withSchedule(scheduleOptions)
  .withPriority(5)
  .withMaxRetries(3)
  .withRetryDelay(1000)
  .useRetryStrategy('exponential')
  .withHook('onStart', async () => console.log('Test'))
  .withHook('onComplete', async () => console.log('Test'))
  .useMiddleware(loggingMiddleware)
  .build();

async function testJob() {
  await job.execute();
}

testJob();

//

import { NotificationBuilder } from '../core/notifications/templates/t';
import { TemplateType } from '../core/notifications/templates/templates';

const tester = new NotificationBuilder();
tester.setTemplate(TemplateType.ShippingUpdate, { trackingNumber: 'yeet.com' }).send();

//
