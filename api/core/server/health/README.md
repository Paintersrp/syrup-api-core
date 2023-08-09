# HealthCheckService

`HealthCheckService` is a comprehensive and powerful service designed to monitor, track and manage the health status of your application. By scheduling and performing health checks, this service helps maintain optimal uptime and swiftly handles contingencies with the help of optional remediation functions.

## Table of Contents

1. [Overview](#overview)
2. [Architecture and Design](#architecture-and-design)
3. [API Documentation](#api-documentation)
4. [Quick Start Guide](#quick-start-guide)

## Overview

Health checks are critical to any application's resilience, enabling early detection and resolution of issues that might affect the availability and performance of your service. `HealthCheckService` is designed to assist in these tasks, providing a framework to define, schedule and execute health checks, and apply remediation procedures when necessary.

## Architecture and Design

`HealthCheckService` adopts a clean, modular architecture that respects the Single Responsibility Principle, promoting maintainability and scalability. It is built upon four pillars:

1. **UptimeTracker**: An internal utility to keep track of your application's uptime, which is leveraged by `HealthCheckOperations`.

2. **HealthCheckOperations**: This service is responsible for executing the health checks, depending on a logger, a map of health checks and an instance of `UptimeTracker`.

3. **HealthCheckScheduler**: A service designed to manage the timing and execution of health checks. It requires a logger and an instance of `HealthCheckOperations`.

4. **SyLogger**: An application-wide logging service that records important events and errors.

`HealthCheckService` coordinates these components, providing a concise API for defining, managing and running health checks.

## API Documentation

### `constructor(logger: SyLogger)`

Initializes an instance of `HealthCheckService`. Accepts a logger instance as an argument.

Example:

```javascript
const logger = new SyLogger();
const healthCheckService = new HealthCheckService(logger);
```

### `registerHealthCheck(name: string, check: HealthCheck, remediate?: RemediationFunction)`

Enlists a new health check function identified by a unique name. Optionally, a remediation function can be specified that triggers when the health check fails.

Example:

```javascript
healthCheckService.registerHealthCheck(
  'dbCheck',
  async () => {
    // Check database connectivity
  },
  async () => {
    // Remediation actions
  }
);
```

### `unregisterHealthCheck(name: string)`

Removes a health check function, identified by its unique name.

Example:

```javascript
healthCheckService.unregisterHealthCheck('dbCheck');
```

### `performHealthChecks()`

Executes all registered health checks.

Example:

```javascript
await healthCheckService.performHealthChecks();
```

### `performHealthCheck(check: string | HealthCheckWithRemediation)`

Performs a specific health check, either by name or by directly providing a health check object.

Example:

```javascript
await healthCheckService.performHealthCheck('dbCheck');
// or
await healthCheckService.performHealthCheck({
  check: async () => {
    /* ... */
  },
  remediate: async () => {
    /* ... */
  },
});
```

### `scheduleHealthChecks(interval: number)`

Schedules health checks to occur at a specified interval (in milliseconds).

Example:

```javascript
healthCheckService.scheduleHealthChecks(60000); // Every 60 seconds
```

### `pauseScheduledHealthChecks()`

Pauses any running scheduled health checks.

Example:

```javascript
healthCheckService.pauseScheduledHealthChecks();
```

### `resumeScheduledHealthChecks(interval: number)`

Resumes paused health checks, commencing from where they were interrupted.

Example:

```javascript
healthCheckService.resumeScheduledHealthChecks(60000); // Every 60 seconds
```

### `stopScheduledHealthChecks()`

Stops any running scheduled health checks.

Example:

```javascript
healthCheckService.stopScheduledHealthChecks();
```

## Quick Start Guide

Start using `HealthCheckService` in your application with this easy guide:

1. **Create an instance of `HealthCheckService`**

```javascript
import { SyLogger, HealthCheckService } from './path/to/your/module';

const logger = new SyLogger();
const healthCheckService = new HealthCheckService(logger);
```

2. **Register Health Checks**

Define a health check function. For example, checking database connectivity:

```javascript
healthCheckService.registerHealthCheck(
  'dbCheck',
  async () => {
    // Check for database connectivity here
  },
  async () => {
    // Optional remediation function
  }
);
```

3. **Perform and Schedule Health Checks**

Manually execute health checks or schedule them for regular intervals:

```javascript
// Perform all health checks once
await healthCheckService.performHealthChecks();

// Schedule health checks to run every 60 seconds
healthCheckService.scheduleHealthChecks(60000);
```

With this guide, you are now well-equipped to use the `HealthCheckService` to actively monitor and maintain the health and uptime of your application.
