<h1 align="center">Syrup Scheduler</h1>

<p align="center">
    <!-- <a href="#installation"><img src="https://img.shields.io/badge/-Installation-brightgreen?style=for-the-badge" alt="Installation"/></a> -->
    <a href="#getting-started"><img src="https://img.shields.io/badge/-Getting%20Started-blue?style=for-the-badge" alt="Getting Started"/></a>
    <a href="#api"><img src="https://img.shields.io/badge/-API-yellow?style=for-the-badge" alt="API"/></a>
    <a href="#examples"><img src="https://img.shields.io/badge/-Examples-orange?style=for-the-badge" alt="Examples"/></a>
    <a href="#contributing"><img src="https://img.shields.io/badge/-Contributing-red?style=for-the-badge" alt="Contributing"/></a>
    <a href="#license"><img src="https://img.shields.io/badge/-License-lightgrey?style=for-the-badge" alt="License"/></a>
</p>

The Scheduler class in the Syrup Framework offers a robust interface for scheduling, initiating, and terminating tasks using cron syntax.

## Contents

<!-- - [Installation](#installation) -->
- [Getting Started](#getting-started)
- [API](#api)
  - [Constructor](#constructor)
  - [Methods](#methods)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

<!-- ## Installation

The Scheduler module is part of the larger Syrup framework. Install the entire framework using npm:

```bash
npm install syrup-framework
```

Or, to install only the Scheduler module:

```bash
npm install syrup-scheduler
``` -->

## Getting Started

After installation, you can import the `Scheduler` class as follows:

```typescript
import { Scheduler } from 'syrup-scheduler';
```

Create a new `Scheduler` instance:

```typescript
const scheduler = new Scheduler();
```

You can now add jobs to the scheduler and control their lifecycle.

## API

### Constructor

The `Scheduler` class constructor takes no arguments:

```typescript
new Scheduler();
```

### Methods

The `Scheduler` class exposes the following methods:

#### `scheduler.addJob(job: Job): void`

Adds a new job to the scheduler. If a job with the same name already exists, it logs an info message.

#### `scheduler.getJob(name: string): Job | undefined`

Returns a job by its name. If no job with the given name exists, it returns `undefined`.

#### `scheduler.jobExists(name: string): boolean`

Checks if a job with the given name exists. Returns `true` if the job exists, `false` otherwise.

#### `scheduler.removeJob(name: string): void`

Removes a job from the scheduler. If the job does not exist, it logs an info message.

#### `scheduler.startJob(name: string): void`

Starts a job. If the job does not exist, it logs an info message.

#### `scheduler.stopJob(name: string): void`

Stops a job. If the job does not exist, it logs an info message.

#### `scheduler.rescheduleJob(name: string, schedule: string): void`

Reschedules a job. If the job does not exist, it logs an info message.

## Examples

### Scheduling a Job

Here's an example of scheduling a job:

```typescript
import { Job } from 'syrup/jobs';

// Define a new job
const job = new Job({
  name: 'My Job',
  schedule: '* * * * *', // every minute
  execute: async () => {
    console.log('Job executed');
  },
});

// Add the job to the scheduler
scheduler.addJob(job);
```

This job will now run every minute, and will log "Job executed" each time it runs.

## Contributing

We welcome contributions to the Scheduler module! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

The Scheduler module is [MIT licensed](LICENSE).
