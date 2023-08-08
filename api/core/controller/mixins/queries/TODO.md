# QueryProcessor TODO List

## Pagination

- [x] Implement cursor-based pagination

## Sorting

- [x] Enable multi-field sorting
- [x] Nested field sorting
- [->] Error handling for invalid sort fields

## Filtering

- [x] Enhance filtering for complex logical conditions (and, or, not)
- [->] Case-insensitive filtering
- [x] Filter operator validation to prevent SQL injections
- [->] Allow filtering on aggregate functions results

## Search

- [->] Advanced full-text search
- [x] Multi-field search
- [x] Customizable search operator (like, ilike, etc.)
- [->(Posts)] Implement search score and sort by relevance

## Includes (Joins)

- [ ] Support nested includes (joining on fields of joined tables)
- [ ] Add include model filtering, sorting, and pagination
- [ ] Error handling for invalid include models

## Error Handling

- [ ] Detailed error messages

## Code Quality

- [x] Code refactoring
- [x] Enhance typings
- [x] Comment complex code blocks
- [x] Use design patterns for structuring the code (if applicable)

## Documentation

- [ ] Write a comprehensive README, API documentation with examples
- [x] JsDoc for function documentation

## Security

- [x] Implement rate limiting to prevent abuse
- [x] Add support for role-based access control (RBAC)
- [x] Data validation and sanitization

## Performance

- [x] Query optimization
- [x] Implement lazy-loading where possible
- [ ] Use indices efficiently

## Miscellaneous

- [x] Support for soft-deleted records with paranoid option in Sequelize
- [x] Implement hooks or middleware for query modification or validation
- [->] Implement data export functionalities (CSV, Excel, etc.)
- [->] Multilingual support for error messages and logs (if applicable)

## Tests

- [ ] Unit tests for all functionalities
- [ ] Integration tests for the entire flow
- [ ] Edge cases testing
- [ ] Error handling testing
- [ ] Performance testing
