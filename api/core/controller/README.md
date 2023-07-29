# **SyController**

The SyController class is an extensible, feature-rich Koa.js middleware controller. It's a powerful class which takes care of common backend controller operations such as handling HTTP requests and responses, data validation, database transaction management, logging, rate limiting, and more. It leverages Sequelize for database operations and Yup for schema validation.

SyController has been designed to be highly flexible and easy to extend or customize according to specific needs.

#

## Key Features

1. **Scalable CRUD Operations**: Easily performs create, read, update, and delete operations on a Sequelize model.
2. **Data Validation**: Uses Yup for data validation before performing CRUD operations.
3. **Middleware Application**: Supports custom middleware application for extending the functionality.
4. **Cache Endpoint**: It can cache the response of an endpoint and serve the cached response if available.
5. **Meta Endpoint**: Fetch metadata related to the Sequelize model.
6. **Error Handling**: In-built decorators for logging, retry mechanism, and Etag for HTTP caching.

#

## Initialization

You can initialize the `SyController` by extending it to create a new controller. This new class will inherit all the functionalities provided by the `SyController`.

```javascript
class UserController extends SyController {
  constructor(options) {
    super(options);
    // add custom logic here
  }
}

const userController = new UserController({
  model: UserModel,
  schema: UserSchema,
  logger: pino(),
});
```

The constructor requires an `options` object with the following parameters:

- `model`: Sequelize model that represents the database table.
- `schema`: Yup schema used for validating request body data.
- `logger`: The instance of application logger.
- `middlewares` (optional): An array of custom middlewares to be used in this controller.

#

## API

The `SyController` provides the following public methods:

### validate(fields: Optional<any, string>): Promise

This method is used for validating input data according to the schema defined during the controller's creation. The method uses the Yup schema and returns a promise.

### cacheEndpoint(ctx: Router.RouterContext, next: Koa.Next): Promise

This method provides a caching mechanism for any endpoint it is applied to. It caches the response of an endpoint and serves the cached response if available.

### options(ctx: Router.RouterContext, next: () => Promise<any>): Promise

This method is used to handle OPTIONS HTTP requests.

### validateBody(ctx: Router.RouterContext, next: Koa.Next): Promise

This middleware method validates the request body against the schema defined during the controller's creation. It utilizes the Yup schema and is extremely useful in CRUD operations.

### all(ctx: Router.RouterContext): Promise

A method to retrieve all instances of the model from the database.

### read(ctx: Router.RouterContext): Promise

A method to retrieve a specific instance of the model from the database.

### create(ctx: Router.RouterContext): Promise<void>

A method to create a new instance of the model in the database.

### update(ctx: Router.RouterContext): Promise<void>

A method to update a specific instance of the model in the database.

### delete(ctx: Router.RouterContext): Promise<void>

A method to delete a specific instance of the model from the database.

### getMetadata(ctx: Router.RouterContext): Promise<void>

A method to retrieve and return the metadata of a Sequelize model.

#

## Usage Examples

### Routing

When using Koa.js, you can bind these methods to routes. Here's an example using `koa-router`:

```javascript
const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

const userController = new UserController({
  model: UserModel,
  schema: UserSchema,
  logger: pino(),
});

router.get('/users/:id', userController.read);
router.get('/users', userController.all);
router.post('/users', userController.create);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
```

In the example above, we've created routes for creating, reading, updating, and deleting instances of a `User` model. The controller methods are tied to these routes, giving you a fully functional API for a `User` model.

## Customization

`SyController` is designed to be extended. If you need more customized functionality, you can extend the class and override the methods.

```javascript
class CustomUserController extends SyController {
  constructor(options) {
    super(options);
  }

  // Override the read method
  async read(ctx: Router.RouterContext) {
    const result = await super.read(ctx);
    // custom processing...
    return result;
  }
}

const customUserController = new CustomUserController({
  model: UserModel,
  schema: UserSchema,
  logger: pino(),
});
```

In this example, we override the `read` method to add custom processing.

Remember to always call `super.<method>` to retain the existing functionality of the `SyController`.

## Notes

The `SyController` class uses decorators such as `@Monitor`, `@Log`, `@Retry`, and `@ETag`. These are not part of the standard JavaScript or TypeScript language and might require additional setup or libraries.

## Conclusion

`SyController` provides a robust base to build upon for creating Koa.js controllers. It encapsulates many common CRUD operations, while allowing extensive customization for your unique needs. Remember to check out the specific libraries (Sequelize, Yup) and frameworks (Koa.js) used in this class to understand their full capabilities.
