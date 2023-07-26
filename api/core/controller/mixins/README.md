# Koa-Sequelize API Utilities

## Introduction

This project provides a robust set of utility classes and methods to facilitate building secure, scalable RESTful APIs using Koa.js and Sequelize.

## Usage

This package offers several utility classes including `SyReadMixin`, `SyMixin` and `RequestProcessor`. Here's a basic example:

```javascript

```

# API References

## **`SyReadMixin`**

The `SyReadMixin` class provides two basic CRUD operations: read one record and read all records.

#

#### **`all(ctx)`**

Fetches all records from the associated model. Records can be filtered, sorted, and paged based on query parameters.

- `ctx` - Koa context.

#

#### **`read(ctx)`**

Fetches a single record identified by id.

- `ctx` - Koa context.

---

## **`SyMixin`**

The `SyMixin` class provides a set of utility methods for request handling and response creation.

#

#### `createResponse(ctx, status, body)`

Sets the response body and status code.

- `ctx` - Koa context.
- `status` - HTTP status code.
- `body` - Response body.

#

#### `findItemById(id, transaction)`

Finds a record identified by id.

- `id` - Id of the record.
- `transaction` (optional) - Sequelize transaction.

---

## **`RequestProcessor`**

The `RequestProcessor` class provides methods to process and validate request data for CRUD operations.

#

#### `processPayload(ctx, arrayCheck)`

Processes the request payload.

- `ctx` - Koa context.
- `arrayCheck` - Boolean flag to check if payload is an array.

#

#### `processIdParam(ctx)`

Processes the 'id' request param.

- `ctx` - Koa context.

#

#### `processQueryParams(ctx)`

Processes the query parameters for pagination, sorting, and filtering.

- `ctx` - Koa context.

---

### Interfaces

This package also provides several TypeScript interfaces to enforce type safety:

#

#### `ControllerMixinOptions`

The options object for the mixin classes' constructors.

#

#### `QueryParams`

Query parameters for list endpoints, including pagination, sorting, and filtering.

#

#### `AdvancedFilterOptions`

Advanced filtering options for list endpoints.

#

#### `ControllerQueryOptions`

An interface combining `QueryParams` and `AdvancedFilterOptions`.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---
