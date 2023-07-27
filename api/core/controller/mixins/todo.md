# TODO LIST

## **SyMixin Class**

#### Complete

- [x] Implement detailed error handling for each method, considering various edge cases.
- [x] Add functionality to `findItemById` to support finding by different unique identifiers (email, username, etc.)
- [x] Refactor existing methods to reduce any code duplication and improve code readability.
- [x] Implement additional utility methods based on common API needs (bulk updates, transaction handling, etc.)
- [x] Revisit all methods where type 'any' is used and replace with more specific types.
- [x] Optimize methods that are likely to cause performance bottlenecks under heavy load.
- [x] Evaluate need for soft delete functionality in `findItemById` and other deletion methods.
- [x] Build a proper logging system for debugging and tracking system behaviour.
- [x] Add detailed data validation rules in `processPayload`.
- [x] Implement detailed pagination, sorting, and filtering options in `processQueryParams`.
- [x] Improve user-friendliness of error messages, considering different client needs (end-users, developers, etc.)
- [x] Expand functionality for complex queries, such as nested queries and querying across relationships.
- [x] Implement measures to prevent SQL injection and ensure data security.
- [x] Consider middleware for common tasks like authentication and authorization.
- [x] Improve granularity of HTTP status codes and error messages returned by BadRequestError and NotFoundError.

#### Incomplete

- [WIP] Implement a change tracking mechanism to keep a history of important data changes.

#### Backlog

- [->] Implement event emitters to notify other parts of the system about significant actions in the class.
- [->] Add multi-language support for error messages and responses.

#

## SyMixin Interfaces and Options

- [x] Allow for per-request configuration of certain behaviours.
- [x] Create interfaces for expected request bodies based on different routes.
- [x] Build customizable behaviours for sorting and filtering in `processQueryParams`.

#### Complete

#### Incomplete

#### Backlog

#

## Test Coverage

#### Complete

#### Incomplete

#### Backlog

- [ ] Write unit tests for all methods in `SyMixin`.
- [ ] Create tests for handling invalid inputs and edge cases.
- [ ] Evaluate class performance under high load and stress tests.
- [ ] Test class behaviour during system shutdown and unexpected interruptions.
- [ ] Mock dependencies for isolated unit testing.
- [ ] Evaluate need for integration tests to ensure correct interaction with other system parts.

#

## Documentation and Code Quality

#### Complete

#### Incomplete

#### Backlog

- [x] Improve comments in the code, explaining the "why" behind complex logic.
- [x] Add JSDoc style comments for all methods, classes, and interfaces.
- [x] Refactor complex code into simpler, smaller functions for better readability.
- [ ] Write a comprehensive README.md, covering use cases, examples, and API documentation.
- [ ] Readme v2
