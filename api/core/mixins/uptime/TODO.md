# Todo for UptimeTracker Module

## Code Refactoring and Optimization

- [x] Perform a detailed code review for potential optimization points.
- [x] Refactor repetitive code blocks into reusable functions.
- [x] Identify potential code smells and refactor them based on best practices.
- [x] Evaluate the efficiency of the `uptimeRecords` data structure for the current use case.
- [x] Analyze potential memory leaks and optimize `autoUpdateRecords()` function.

## Functionality Extensions

- [x] Create a method to delete an uptime record based on the name.
- [x] Implement a method to manually trigger the update of uptime records.
- [x] Allow the `autoUpdateIntervalMs` to be changed after the instance has been created.

## Compositional Classes & Modularity

- [x] Consider creating a `UptimeRecord` class to encapsulate uptime record related logic.
- [x] Consider abstracting the `setInterval()` and `clearInterval()` into a `Scheduler` class for more complex scheduling.

## Future Expansions

- [x] Design an API endpoint to expose the module functionalities.
- [x] Develop an authentication mechanism for secure API usage.
- [x] Implement detailed activity logging for troubleshooting and auditing.

## Testing

- [ ] Write unit tests for each function in the module.
  - [ ] `updateUptimeRecord()`
  - [ ] `processUptimeChange()`
  - [ ] `getUptime()`
  - [ ] `getAllUptimes()`
  - [ ] `calculateRelativeUptime()`
  - [ ] `calculateRelativeLastChecked()`
  - [ ] `autoUpdateRecords()`
  - [ ] `stopAutoUpdate()`
- [ ] Write integration tests for the module.
- [ ] Identify edge cases for each function and write tests for those.
- [ ] Setup continuous integration for automated testing.
- [ ] Perform load testing to understand the module's behavior under significant stress.

## Documentation

- [x] Write comprehensive JSDoc for each function.
- [x] Create a detailed README/comprehensive usage guide and API documentation for the module including its purpose, usage, and examples.

## Deployment and Operations

- [ ] Define and document the deployment process.
- [ ] Set up staging and production environments.
- [ ] Create Dockerfile if containerization is desired.
- [ ] Implement monitoring and logging strategies for the module in production.
- [ ] Set up alerting for critical issues.
- [ ] Plan a backup and disaster recovery strategy.
- [ ] Evaluate the module's performance, resource usage, and scalability.
- [ ] Assess and improve the security of the module considering best practices.
- [ ] Plan for module versioning and release management.
