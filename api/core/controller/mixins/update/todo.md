# TODO LIST

## **SyUpdateMixin Class**

#### Complete

- [x] Extend `processPayload` method to validate the fields being updated against a schema or model definition
- [x] Enhance `findItemById` method to include more details in the error message, such as which ID was not found
- [x] Implement concurrency control for both `update` and `bulkUpdate` methods to handle race conditions
- [x] Implement error handling for `update` method with more specific exceptions, including when a field does not exist or when the data type is incorrect
- [x] Implement error handling for `bulkUpdate` method with more specific exceptions, including handling incomplete data or invalid fields
- [x] Implement security measures to prevent sensitive fields from being updated, such as user role or password hash
- [x] Implement a transaction rollback mechanism in `bulkUpdate` method in case any single update fails
- [x] Implement rate-limiting or throttling for `bulkUpdate` method to prevent abuse and overloading
- [x] Add support for partial updates (PATCH) in the `update` method
- [x] Implement detailed logging for `update` and `bulkUpdate` methods, including before and after states and any errors
- [x] Add exception handling for Sequelize's `save` method in `update` and `bulkUpdate` methods to handle database exceptions
- [x] Replace `any` TypeScript types in all methods with strict typings to increase type safety and reduce potential bugs

#### Incomplete

#### Backlog

#

## Method Enhancements and New Features:

#### Complete

- [x] Implement a method to retrieve the previous state of the items after updating for audit logging purposes
- [x] Implement failure tolerance in `bulkUpdate` method, to continue updating other items even if one update fails

#### Incomplete

#### Backlog

- [->] Implement a mechanism to optionally check for the existence of an item before updating in `update` and `bulkUpdate` methods
- [->] Implement an event-driven mechanism that emits events on successful or failed updates

#

## Test Coverage:

#### Complete

#### Incomplete

#### Backlog

- [ ] Add test cases for each public method in the `SyUpdateMixin` class
- [ ] Add test cases for handling invalid inputs and ensuring proper error messages are thrown
- [ ] Test behavior under high load, ensuring that updates can handle concurrent requests
- [ ] Test rollback behavior during failed `bulkUpdate` operations to ensure data integrity
- [ ] Mock dependencies like database and logger for unit testing, ensuring tests are isolated and reproducible
- [ ] Add stress and performance tests to verify the maximum load the update methods can handle

#

## Documentation and Code Quality:

#### Complete

#### Incomplete

#### Backlog

- [x] Improve inline comments for all methods, including private helper methods
- [x] Add JSDoc style comments for all classes, methods, and interfaces, including type definitions and return types
- [x] Refactor code for better readability, including breaking down long methods and improving variable naming
- [ ] Create a README.md with usage examples and API documentation, including a simple step-by-step guide for new users
