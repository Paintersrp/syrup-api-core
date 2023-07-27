# README.md

## SyMixin: Koa/Sequelize API Utility Mixin Class

The `SyMixin` is a utility mixin class designed to simplify the development of Koa/Sequelize based APIs. It provides a range of utility methods to streamline the handling of HTTP responses, data fetching from the database, error handling, and more.

## Usage

This mixin class is abstract and should be extended by other classes in your application. When initializing a new instance of a class extending `SyMixin`, you will need to provide a set of options:

```ts
class MyController extends SyMixin {
  constructor(options: ControllerMixinOptions) {
    super(options);
  }
  // ...
}

const controller = new MyController({ model, logger });
```

The `ControllerMixinOptions` should include:

- `model`: A Sequelize model, representing a table in your database.
- `logger`: A Pino logger instance.

## API

### `findItemById(id: string, transaction?: Transaction): Promise<Model>`

This method fetches an item from the database based on its primary key. If no item is found, a `NotFoundError` is thrown.

### `findItem(field: string, value: string | number, transaction?: Transaction): Promise<Model>`

This method fetches an item from the database based on a field and value. If no item is found, a `NotFoundError` is thrown.

### `getModelName(item: Model): string`

This method returns the name of the model based on an object returned from a Sequelize action.

### `updateModelFields(model: Model, fields: FieldDTO): Model`

This method assigns a new array of fields to a model instance.

### `checkPermission(ctx: RouterContext): Promise<void>`

This method checks if the current user has the necessary permissions to perform an action.

### `processPayload(ctx: RouterContext, arrayCheck: boolean = false): unknown`

This method processes the payload from the request body.

### `processIdParam(ctx: RouterContext): string`

This method processes the 'id' parameter from the Koa Router context.

### `processIdsParam(ctx: RouterContext): string[]`

This method processes the 'ids' parameter from the request body.

### `processQueryParams(ctx: RouterContext): Promise<FindOptions>`

This method processes request query parameters.

## Example

Suppose you have a controller for handling user-related endpoints. This controller could extend `SyMixin` to take advantage of the utility methods:

```ts
import { RouterContext } from 'koa-router';
import { User } from '../../models';
import { SyMixin, ControllerMixinOptions } from './SyMixin';
import { HttpStatus } from '../../lib';

class UserController extends SyMixin {
  constructor(options: ControllerMixinOptions) {
    super(options);
  }

  async getUser(ctx: RouterContext) {
    const userId = this.processIdParam(ctx);
    const user = await this.findItemById(userId);
    this.createResponse(ctx, HttpStatus.OK, user);
  }

  async updateUser(ctx: RouterContext) {
    const userId = this.processIdParam(ctx);
    const updatedFields = this.processPayload(ctx) as Partial<User>;
    const user = await this.findItemById(userId);
    this.updateModelFields(user, updatedFields);
    await user.save();
    this.createResponse(ctx, HttpStatus.OK, user);
  }
}

const userController = new UserController({ model: User, logger: console });
```

In the above example, `UserController` extends `SyMixin` and uses its methods to simplify HTTP response creation, user fetching, and payload processing.
