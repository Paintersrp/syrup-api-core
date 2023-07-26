# Request Processor

This library provides a request processing middleware for Koa applications that interact with a Sequelize-powered database.

## Table of Contents

- [Features](#features)
- [Usage Examples](#usage-examples)
- [API Documentation](#api-documentation)
- [Contribution Guidelines](#contribution-guidelines)
- [Contact Information](#contact-information)

## Features

- Query parameter parsing for Sequelize find operations
- Request payload validation
- Permission checking
- ID and IDs parameter processing
- Advanced filtering options
- Pagination
- Field selection
- Sorting
- Searching
- Range filtering
- Including associated models

## Usage Examples

```javascript
import Koa from 'koa';
import Router from 'koa-router';
import { RequestProcessor, ControllerQueryOptions } from 'koa-sequelize-request-processor';
import { UserModel } from './models'; // Replace with your actual Sequelize model

const app = new Koa();
const router = new Router();
const processor = new RequestProcessor(UserModel);

router.get('/users', async (ctx, next) => {
  await processor.checkPermission(ctx);

  const findOptions = await processor.processQueryParams(ctx);
  const users = await UserModel.findAll(findOptions);

  ctx.body = users;
  await next();
});

app.use(router.routes()).use(router.allowedMethods());
```

## API Documentation

### RequestProcessor

#### `new RequestProcessor(model: ModelStatic<Model>)`

Creates a new RequestProcessor instance for the provided Sequelize model.

### Methods

#### `async checkPermission(ctx: RouterContext): Promise<void>`

Checks if the current user has permission to perform the operation. Throws a `ForbiddenError` if the user does not have permission.

#### `processPayload(ctx: RouterContext, arrayCheck: boolean = false): any`

Processes the request payload. Throws a `BadRequestError` if the payload is missing or if `arrayCheck` is `true` and the payload is not an array.

#### `processIdParam(ctx: RouterContext): string`

Processes the 'id' URL parameter. Throws a `BadRequestError` if the 'id' parameter is missing.

#### `processIdsParam(ctx: RouterContext): string[]`

Processes the 'ids' parameter from the request body. Throws a `BadRequestError` if the 'ids' parameter is missing.

#### `async processQueryParams(ctx: Context): Promise<FindOptions>`

Processes the request's query parameters and constructs a `FindOptions` instance that can be directly used with Sequelize's find operations.

### Interfaces

#### `QueryParams`

The `QueryParams` interface represents a set of query parameters supported by the `RequestProcessor` class.

#### `AdvancedFilterOptions`

The `AdvancedFilterOptions` interface represents a set of advanced query filtering options supported by the `RequestProcessor` class.

#### `ControllerQueryOptions`

The `ControllerQueryOptions` interface extends both `QueryParams` and `AdvancedFilterOptions`, representing a full set of query parameters and filtering options supported by the `RequestProcessor` class.

For detailed information about each interface field, please refer to the source code comments.

#

## Contact Information

For any questions or issues, please open an issue on the GitHub repository.

---
