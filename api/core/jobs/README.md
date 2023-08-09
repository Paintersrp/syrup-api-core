<h1 align="center">Syrup Job</h1>

<p align="center">
    <a href="#installation"><img src="https://img.shields.io/badge/-Installation-brightgreen?style=for-the-badge" alt="Installation"/></a>
    <a href="#getting-started"><img src="https://img.shields.io/badge/-Getting%20Started-blue?style=for-the-badge" alt="Getting Started"/></a>
    <a href="#api"><img src="https://img.shields.io/badge/-API-yellow?style=for-the-badge" alt="API"/></a>
    <a href="#examples"><img src="https://img.shields.io/badge/-Examples-orange?style=for-the-badge" alt="Examples"/></a>
    <a href="#contributing"><img src="https://img.shields.io/badge/-Contributing-red?style=for-the-badge" alt="Contributing"/></a>
    <a href="#license"><img src="https://img.shields.io/badge/-License-lightgrey?style=for-the-badge" alt="License"/></a>
</p>

The Job class in the Syrup Framework represents a job to be scheduled. It encapsulates a task with a given cron schedule, and optional lifecycle hooks.

## Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [API](#api)
  - [Constructor](#constructor)
  - [Properties](#properties)
  - [Methods](#methods)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

The Job module is part of the larger Syrup framework. Install the entire framework using npm:

```bash
npm install syrup-framework
```

Or, to install only the Job module:

```bash
npm install syrup-job
```

## Getting Started

After installation, you can import the `Job` class as follows:

```typescript
import { Job } from 'syrup-job';
```

Create a new `Job` instance:

```typescript
const job = new Job({
  name: 'My Job',
  task: async () => {
    /* task code */
  },
  schedule: '* * * * *',
});
```

## API

### Constructor

The `Job` class constructor takes an options object:

```typescript
new Job(options: JobOptions);
```

### Properties

The `Job` class exposes the following properties:

- `name`: The name of the job.
- `task`: The task to be executed when the job runs.
- `schedule`: The schedule for the job in cron format.
- `hooks`: Optional lifecycle hooks for the job.
- `status`: The current status of the job. Can be 'idle', 'running', 'paused', 'completed', or 'error'.
- `priority`: The priority of the job.
- `retryCount`: The current retry count for the job.

### Methods

The `Job` class exposes the following methods:

- `addHook(hook: keyof JobHooks, callback: () => void): void`: Adds a hook to the job.
- `removeHook(hook: keyof JobHooks): void`: Removes a hook from the job.
- `pause(): void`: Pauses the job if it's currently running.
- `resume(): Promise<void>`: Resumes the job if it's currently paused, and re-executes the task.
- `execute(): Promise<void>`: Executes the task of the job.

## Examples

Here's an example of creating a job:

```typescript
import { Job } from 'syrup-job';

// Define a new job
const job = new Job({
  name: 'My Job',
  task: async () => {
    console.log('Job executed');
  },
  schedule: '* * * * *', // Every minute
});

// Add hooks to the job
job.addHook('onStart', () => console.log('Job started'));
job.addHook('onComplete', () => console.log('Job completed'));
```

## Contributing

We welcome contributions to the Job module! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

The Job module is [MIT licensed](LICENSE).

---
