# TODO.md

## Tasks

### Core Functionality

- [x] **Task**: Separate the concerns of `model` validation into its own utility class.
- [->] **Task**: Develop support for complex/nested query parameters.
- [x] **Task**: Integrate an exception handling middleware for managing the exceptions from the RequestProcessor class.
- [WIP] **Task**: Remove hardcoded elements such as `MAX_PAGE_SIZE` and `validSortOptions` and replace them with config files.
- [->] **Task**: Develop support for multi-criteria sorting.
- [x] **Task**: Simplify the `addQueryCondition` method and reduce its complexity.
- [x] **Task**: Implement additional comparison operators within `addQueryCondition`.
- [x] **Task**: Implement default sorting and ordering options.
- [x] **Task**: Develop support for pagination links within the response headers.
- [x] **Task**: Incorporate a Web Application Firewall (WAF) to protect against common web threats
- [->] **Task**: Prepare the code to support horizontal scaling.
- [x] **Task**: Add functionality for processing additional types of parameters, not just 'id' and 'ids'.
- [x] **Task**: Implement a method to validate the payload structure against a predefined schema.
- [x] **Task**: Extend the `assertExists` method to check for other conditions like data type, value range, etc.
- [x] **Task**: Consider replacing `any` types with more specific ones to leverage TypeScript's static typing.

### Testing

- [ ] **Test**: Develop comprehensive unit tests for each method in `RequestProcessor`.
- [ ] **Test**: Ensure each helper method is properly unit tested.
- [ ] **Test**: Verify that `RequestProcessor` interacts with an actual model as expected.
- [ ] **Test**: Develop integration tests for `RequestProcessor`.
- [ ] **Test**: Create system tests for `RequestProcessor`.
- [ ] **Test**: Introduce end-to-end tests for `RequestProcessor`.

### Documentation

- [x] **Documentation**: Provide inline comments for complex segments of code.
- [x] **Documentation**: Create comprehensive JSDoc for each class and method.

### Optimization

- [x] **Optimization**: Improve performance of `processQueryParams`.
- [x] **Optimization**: Identify and eliminate code duplication.
- [x] **Optimization**: Reduce cyclomatic complexity across all methods.
- [x] **Optimization**: Improve memory usage in `RequestProcessor`.
- [x] **Optimization**: Check and improve thread safety in `RequestProcessor`.
