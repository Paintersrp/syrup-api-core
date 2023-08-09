# Comprehensive Guide to HealthCheck Composition

This guide is designed to provide in-depth instructions for creating and managing health checks within your application using the HealthCheckService. This comprehensive guide will walk you through the utilization of SimpleCheck, ComposedCheck, and DependentCheck classes as an API for composing health checks.

## Table of Contents

1. [Introduction](#introduction)
2. [The `SimpleCheck` Class](#simplecheck)
   1. [Creating a `SimpleCheck`](#simplecheck-create)
   2. [Setting Hooks](#simplecheck-hooks)
3. [The `ComposedCheck` Class](#composedcheck)
   1. [Creating a `ComposedCheck`](#composedcheck-create)
   2. [Setting Hooks](#composedcheck-hooks)
4. [The `DependentCheck` Class](#dependentcheck)
   1. [Creating a `DependentCheck`](#dependentcheck-create)
   2. [Setting Hooks](#dependentcheck-hooks)
5. [Conclusion](#conclusion)

<a name="introduction"></a>

## Introduction

Effective health checks are essential for maintaining the robustness and reliability of your application. The HealthCheckService offers an API for defining and orchestrating health checks to ensure your services and dependencies are performing as expected.

<a name="simplecheck"></a>

## The `SimpleCheck` Class

The `SimpleCheck` class is the fundamental building block for creating health checks. It provides an encapsulation of a single health check with hooks for pre-check, post-check, and error handling.

<a name="simplecheck-create"></a>

### Creating a `SimpleCheck`

Below is an example illustrating how to create a `SimpleCheck` instance.

```typescript
import { HealthCheckWithRemediation } from '../types';
import { SimpleCheck } from './SimpleCheck';

// Define your health check function
const databaseHealthCheck: HealthCheckWithRemediation = {
  check: async () => {
    // Your health checking logic goes here...
    // This function should return true if the check passes, and false otherwise.
  },
  remediate: async () => {
    // Remediation logic goes here...
  },
};

// Create a SimpleCheck
const dbCheck = new SimpleCheck('DatabaseHealthCheck', databaseHealthCheck);
```

<a name="simplecheck-hooks"></a>

### Setting Hooks

After creating a `SimpleCheck`, you can assign optional hooks for additional functionality before and after the check, and upon encountering an error.

```typescript
// Set the hooks
dbCheck.onBeforeCheck = () => console.log('Starting the database health check...');
dbCheck.onAfterCheck = (result) =>
  console.log(`Database health check completed. Result: ${result}`);
dbCheck.onError = (error) => console.log(`An error occurred: ${error}`);
```

<a name="composedcheck"></a>

## The `ComposedCheck` Class

The `ComposedCheck` class enables you to bundle multiple checks (including `SimpleCheck`, `ComposedCheck`, and `DependentCheck` instances) into a single unit, executing them in parallel.

<a name="composedcheck-create"></a>

### Creating a `ComposedCheck`

The following code demonstrates how to combine two `SimpleCheck` instances into a `ComposedCheck`.

```typescript
import { SimpleCheck, ComposedCheck } from './checks';

// Assume dbCheck and serverCheck are instances of SimpleCheck
const dbAndServerCheck = new ComposedCheck('DatabaseAndServerCheck', [dbCheck, serverCheck]);
```

<a name="composedcheck-hooks"></a>

### Setting Hooks

Similar to `SimpleCheck`, `ComposedCheck` also offers hooks for events. However, the `onAfterCheck` event will return the overall result of all checks.

```typescript
// Set the hooks
dbAndServerCheck.onBeforeCheck = () => console.log('Starting the composed check...');
dbAndServerCheck.onAfterCheck = (result) =>
  console.log(`Composed check completed. Overall result: ${result}`);
dbAndServerCheck.onError = (error) =>
  console.log(`An error occurred during one of the checks: ${error}`);
```

<a name="dependentcheck"></a>

## The `DependentCheck` Class

The `DependentCheck` class enables creating health checks that rely on the success of another health check.

<a name="dependentcheck-create"></a>

### Creating a `DependentCheck`

The following snippet provides an example of a `DependentCheck` that is contingent on the `dbCheck`.

```typescript
import { SimpleCheck, DependentCheck } from './checks';

// Assume dbCheck is an instance of SimpleCheck
// Define another health check function that depends on the success of dbCheck
const dependentCheckFn = async () => {
  // Insert dependent health checking logic here...
  // The function should return true if the check passes and false otherwise.
};

const dependentCheck = new DependentCheck('DependentCheck', dbCheck, dependentCheckFn);
```

<a name="dependentcheck-hooks"></a>

### Setting Hooks

The hooks for a `DependentCheck` function similarly to those in `SimpleCheck`.

```typescript
// Set the hooks
dependentCheck.onBeforeCheck = () => console.log('Starting the

 dependent check...');
dependentCheck.onAfterCheck = (result) => console.log(`Dependent check completed. Result: ${result}`);
dependentCheck.onError = (error) => console.log(`An error occurred during the check: ${error}`);
```

<a name="conclusion"></a>

# Health Check Service

This service is designed to facilitate the monitoring of the uptime and health status of the application. It provides a comprehensive API for managing health checks, which can be used directly or in combination with the `SimpleCheck`, `ComposedCheck`, and `DependentCheck` classes for a rich and versatile health check experience.

## Basic Usage

Create an instance of the `HealthCheckService` with an instance of `SyLogger`:

```typescript
import { SyLogger } from '../../logging/SyLogger';
import { HealthCheckService } from './HealthCheckService';

const logger = new SyLogger();
const healthCheckService = new HealthCheckService(logger);
```

### Register a Health Check

Register a health check function with a name:

```typescript
import { HealthCheck, RemediationFunction } from './types';

const check: HealthCheck = async () => {
  // Check logic goes here
  return true; // or false
};

const remediate: RemediationFunction = async () => {
  // Remediation logic goes here
};

healthCheckService.registerHealthCheck('myCheck', check, remediate);
```

### Unregister a Health Check

Unregister a health check function by its name:

```typescript
healthCheckService.unregisterHealthCheck('myCheck');
```

### Perform Health Checks

Perform all registered health checks:

```typescript
const allHealthy = await healthCheckService.performHealthChecks();
console.log(`All checks healthy: ${allHealthy}`);
```

Perform a specific health check:

```typescript
const checkHealthy = await healthCheckService.performHealthCheck('myCheck');
console.log(`Check healthy: ${checkHealthy}`);
```

### Scheduling Health Checks

Schedule health checks to run at a regular interval (in milliseconds):

```typescript
healthCheckService.scheduleHealthChecks(30000); // every 30 seconds
```

Pause, resume, and stop scheduled health checks:

```typescript
healthCheckService.pauseScheduledHealthChecks();
healthCheckService.resumeScheduledHealthChecks(30000);
healthCheckService.stopScheduledHealthChecks();
```

## Advanced Usage with Health Check Classes

In addition to the basic usage outlined above, the `HealthCheckService` can be used in conjunction with the `SimpleCheck`, `ComposedCheck`, and `DependentCheck` classes for more advanced health check scenarios. This allows for the composition of health checks, which can be performed sequentially or in parallel, with optional hooks for additional functionality.

### SimpleCheck

The `SimpleCheck` class encapsulates a single health check, optionally with hooks for functionality before and after the check, and upon encountering an error. A `SimpleCheck` can be registered with the `HealthCheckService` as shown below:

```typescript
import { SimpleCheck } from './checks';

const myCheck = new SimpleCheck('myCheck', someCheckFunction);
healthCheckService.registerHealthCheck(myCheck.name, myCheck.perform);
```

### ComposedCheck

The `ComposedCheck` class enables you to bundle multiple checks (including `SimpleCheck`, `ComposedCheck`, and `DependentCheck` instances) into a single unit, which are then executed in parallel. A `ComposedCheck` can be registered with the `HealthCheckService` as shown below:

```typescript
import { ComposedCheck } from './checks';

// Assume dbCheck and serverCheck are instances of SimpleCheck
const composedCheck = new ComposedCheck('ComposedCheck', [dbCheck, serverCheck]);
healthCheckService.registerHealthCheck(composedCheck.name, composedCheck.perform);
```

### DependentCheck

The `DependentCheck` class enables creating health checks that rely on the success of another health check. A `DependentCheck` can be registered with the `HealthCheckService` as shown below:

```typescript
import { DependentCheck } from './checks';

// Assume dbCheck is an instance of SimpleCheck
const dependentCheck = new DependentCheck('DependentCheck', dbCheck, someDependentCheckFunction);
healthCheckService.registerHealthCheck(dependentCheck.name, dependentCheck.perform);
```

In all of these examples, the `check` parameter provided to the `registerHealthCheck` function is the `perform` method of the respective check class, which encapsulates the execution of the health check(s), including any specified hooks. The `HealthCheckService` manages these checks just as it would any other health check function, including the ability to perform them manually or schedule them to be performed at regular intervals.

## Conclusion

With these classes, you can craft a comprehensive health check system, capable of addressing simple, compound, and interdependent scenarios. The hooks provide integration points for logging or additional monitoring tools, granting you insightful observations about your application's health status. Remember, robust health checks are the heart of any resilient and reliable system.
