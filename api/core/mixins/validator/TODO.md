# SyValidator TODO List

## Improvements

- [x] Move to general mixins
- [x] Implement chainable validation for multiple checks
- [x] Refactor to allow reusability of validation rules across different methods
- [x] Use generic types to specify return types

## Assertions

- [x] Implement assertDate for checking valid date strings
- [x] Implement assertEmail for checking valid email addresses
- [x] Implement assertURL for checking valid URLs
- [x] Implement assertUUID for checking valid UUIDs

## Complex Validations

- [x] Create methods for checking if an object matches a specific schema
- [x] Validate array elements against a specific type or validation rule
- [->] Implement conditional assertions (assert this if that)

## Localization

- [->] Implement multilingual support for error messages
- [->] Use message catalog or i18n library for easy language switching

## Error Handling

- [x] Include the field name in the error message where applicable
- [ ] Replace failing fast
- [->] Include support for custom error messages for each assertion

## Custom Validators

- [ ] Provide a way to extend the library with custom validators
- [ ] Document how to create and use custom validators

## Code Quality

- [ ] Refactor code to make it more readable and maintainable
- [ ] Document each function using JsDoc
- [ ] Add TypeScript types where possible

## Tests

- [ ] Unit tests for all assertions
- [ ] Integration tests for more complex validation scenarios
- [ ] Edge case testing for all assertions
- [ ] Performance testing for large objects and complex validation rules

## Documentation

- [ ] Write a comprehensive README, API documentation with examples
- [ ] Provide examples of usage in different scenarios

## Performance

- [ ] Benchmark different validation scenarios and optimize where necessary
- [ ] Implement lazy validations, only validating when necessary

## Miscellaneous

- [ ] Provide a way to format validated data (trim strings, convert types, etc.)
- [ ] Provide support for asynchronous validators
- [ ] Support for validating files and streams
