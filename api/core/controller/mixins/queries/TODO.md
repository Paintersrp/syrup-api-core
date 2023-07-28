# QueryProcessor TODO List

## Pagination

- [ ] Implement cursor-based pagination
- [ ] Add a toggle to disable pagination
- [ ] Customize the default page size
- [ ] Add reverse pagination (last page first)

## Sorting

- [ ] Enable multi-field sorting
- [ ] Nested field sorting
- [ ] Error handling for invalid sort fields
- [ ] Implement natural language sort (if applicable)

## Filtering

- [ ] Enhance filtering for complex logical conditions (and, or, not)
- [ ] Enable filtering on nested fields
- [ ] Case-insensitive filtering
- [ ] Filter operator validation to prevent SQL injections
- [ ] Allow filtering on aggregate functions results

## Search

- [ ] Advanced full-text search
- [ ] Multi-field search
- [ ] Customizable search operator (like, ilike, etc.)
- [ ] Implement search score and sort by relevance
- [ ] Implement fuzzy search

## Range Filters

- [ ] Enable range queries on multiple fields
- [ ] Range value validation
- [ ] Add support for exclusive range filters

## Includes (Joins)

- [ ] Support nested includes (joining on fields of joined tables)
- [ ] Add include model filtering, sorting, and pagination
- [ ] Error handling for invalid include models

## Error Handling

- [ ] Detailed error messages
- [ ] Verbose mode for errors
- [ ] Implement error logging mechanism

## Caching

- [ ] Implement caching mechanism for heavy queries
- [ ] Invalidate cache upon data modification
- [ ] Set different cache lifetimes depending on the request

## Code Quality

- [x] Code refactoring
- [x] Enhance typings
- [x] Comment complex code blocks
- [x] Use design patterns for structuring the code (if applicable)

## Tests

- [ ] Unit tests for all functionalities
- [ ] Integration tests for the entire flow
- [ ] Edge cases testing
- [ ] Error handling testing
- [ ] Performance testing

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
- [ ] Aggregate functions (count, sum, average, etc.)
- [ ] Implement data export functionalities (CSV, Excel, etc.)
- [->] Multilingual support for error messages and logs (if applicable)
