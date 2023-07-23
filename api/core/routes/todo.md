# TODO LIST

## SyRoutes<T> Class:

- [ ] Add support for more HTTP methods (e.g., PATCH, OPTIONS)
- [ ] Implement route specific middleware (authentication, authorization)
- [ ] Implement middleware for input validation and error handling
- [ ] Implement functionality to add custom routes outside of basic CRUD operations
- [ ] Implement a mechanism to rate limit requests to protect against DoS attacks
- [ ] Add support for route versioning
- [ ] Add optional support for SSL/TLS encryption

## Router Configuration and Interface:

- [ ] Create an interface to define custom routing rules
- [ ] Allow configuration of routing case sensitivity and strict routing
- [ ] Implement a mechanism to handle query string parameters

## Controller Configuration and Integration:

- [ ] Optimize controller integration, currently all routes are initialized during controller assignment
- [ ] Add a mechanism to dynamically change the controller at runtime

## Test Coverage:

- [ ] Add test cases for each public method in SyRoutes class
- [ ] Add test cases for each HTTP method and endpoint
- [ ] Test routing behavior under high load
- [ ] Test behavior with invalid inputs and error handling
- [ ] Mock dependencies like database and logger for unit testing

## Documentation and Code Quality:

- [ ] Improve inline comments for all methods
- [ ] Add JSDoc style comments for all classes, methods, and interfaces
- [ ] Refactor code for better readability
- [ ] Create a README.md with usage examples and API documentation
