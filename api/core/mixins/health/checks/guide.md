# Style Guide for Health Checks using HealthCheckMixin

This style guide provides a structured approach to writing health checks for the `HealthCheckMixin` class using `SimpleCheck`, `ComposedCheck`, and `DependentCheck` classes. Adherence to this guide ensures consistency, readability, and maintainability of the health checks implemented.

## 1. SimpleCheck

`SimpleCheck` is the most basic unit of health checks. It encapsulates a single check. While creating instances, ensure the name is expressive and the check is a valid `HealthCheckWithRemediation`.

```javascript
const dbConnectivityCheck = new SimpleCheck('db_connectivity', {
  check: async () => {
    try {
      const isConnected = await checkDBConnectivity(); // Assume this function checks database connectivity
      return isConnected;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  remediate: async () => {
    try {
      await restartDBService(); // Assume this function attempts to restart the DB service
    } catch (err) {
      console.error('Remediation failed:', err);
    }
  },
});
```

## 2. ComposedCheck

`ComposedCheck` allows for running multiple `SimpleCheck`s together. Each check is independent and doesn't affect the others. Make sure the composed check's name is expressive and each check is a valid `SimpleCheck`.

```javascript
// A SimpleCheck for cache service
const cacheServiceCheck = new SimpleCheck('cache_service', {
  check: async () => {
    try {
      const isConnected = await checkCacheService(); // Assume this function checks cache service health
      return isConnected;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  remediate: async () => {
    try {
      await restartCacheService(); // Assume this function attempts to restart the cache service
    } catch (err) {
      console.error('Remediation failed:', err);
    }
  },
});

// Compose the DB and Cache service checks
const apiHealthCheck = new ComposedCheck('api_health_check', [
  dbConnectivityCheck,
  cacheServiceCheck,
]);
```

## 3. DependentCheck

`DependentCheck` creates a health check that depends on another check (`SimpleCheck`, `ComposedCheck`, or another `DependentCheck`). If the dependency fails, the check won't be performed.

```javascript
const dependentCheck = new DependentCheck('serviceA_dependency_check', apiHealthCheck, async () => {
  try {
    const canReachServiceA = await checkServiceAReachable(); // Assume this function checks if Service A can be reached
    return canReachServiceA;
  } catch (err) {
    console.error(err);
    return false;
  }
});
```

## 4. Registering Checks

Register checks with the `HealthCheckMixin` instance using the `registerHealthCheck` method. Do this at the appropriate time during your application's lifecycle (usually during initialization).

```javascript
const healthCheckMixin = new HealthCheckMixin(logger);

// Register SimpleChecks
healthCheckMixin.registerHealthCheck(
  dbConnectivityCheck.name,
  dbConnectivityCheck.perform,
  dbConnectivityCheck.check.remediate
);
healthCheckMixin.registerHealthCheck(
  cacheServiceCheck.name,
  cacheServiceCheck.perform,
  cacheServiceCheck.check.remediate
);

// Register ComposedCheck
healthCheckMixin.registerHealthCheck(apiHealthCheck.name, apiHealthCheck.perform);

// Register DependentCheck
healthCheckMixin.registerHealthCheck(dependentCheck.name, dependentCheck.perform);
```

## 5. Scheduling Health Checks

Use the `scheduleHealthChecks` method to regularly run checks at an interval. It's crucial to have health checks running periodically to ensure the application's health is regularly verified.

```javascript
healthCheckMixin.scheduleHealthChecks(30000); // Run checks every 30 seconds.
```

Remember to stop the checks properly during the shutdown or if they are no longer needed using `stopScheduledHealthChecks`.

```javascript
healthCheckMixin.stopScheduledHealthChecks();
```

## 6. Error Handling

Ensure that all health checks handle their own errors and return a boolean value. This should be `true` for a passed check and `false` otherwise. This prevents one failing check from stopping others.

## 7. Remediation

If applicable, provide a remediation function when constructing `HealthCheckWithRemediation` objects. This function will be attempted automatically in case the health check fails.

## 8. Naming Conventions

Names for checks should be descriptive and consistent. If possible, follow a specific pattern like `<subject>_<verb>_<noun>` such as `db_check_connectivity`.

## 9. Keep checks light and fast

Health checks are often run frequently and in production environments, so they should be as lightweight and quick as possible. If a check needs to do a lot of work or could potentially take a long time, consider ways you could optimize it or whether it could be broken down into smaller checks.

By following these guidelines, your health checks will remain consistent, maintainable, and easy to read and debug.
