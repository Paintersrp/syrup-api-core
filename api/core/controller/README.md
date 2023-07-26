# **SyController**

SyController is an advanced Koa controller that integrates Sequelize for handling HTTP requests and responses. It includes advanced features such as input validation, transaction management, logging, rate limiting, and more.

#

## **Features**

- Input validation
- Transaction management
- Logging
- Rate limiting
- Extensibility

#

## **Basic Usage**

Here is a basic usage example:

```javascript
import { SyController } from 'your-package-name';
import UserModel from './models/user';
import UserSchema from './schemas/user';
import pino from 'pino';

class UserController extends SyController {
  constructor(options) {
    super(options);
  }
}

const userController = new UserController({
  model: UserModel,
  schema: UserSchema,
  logger: pino(),
});

userRouter.get('/users/:id', userController.read);
```

In this example, `UserModel` is a Sequelize model, and `UserSchema` is a Joi object schema used for validating request body data. The `pino` logger is used for application logging.

#

## **API Documentation**

### **SyController constructor**

The constructor accepts an `options` object that has the following properties:

- `model` (required): A Sequelize model representing the database table.
- `schema` (required): A Joi object schema used for validating request body data.
- `logger` (required): The instance of application logger.
- `middlewares` (optional): An array of custom middlewares to be used in this controller.

```javascript
const userController = new UserController({
  model: UserModel,
  schema: UserSchema,
  logger: pino(),
});
```

#

### **SyController instance methods**

- `create(ctx: Router.RouterContext)`: Asynchronously creates a new instance of the model in a database transaction. The created instance is returned.

  - Usage: `userRouter.post('/users', userController.create);`

- `read(ctx: Router.RouterContext)`: Asynchronously fetches an instance of the model. The model instance is returned.

  - Usage: `userRouter.get('/users/:id', userController.read);`

- `update(ctx: Router.RouterContext)`: Asynchronously updates a specific instance of the model by its ID in a database transaction. The updated instance is returned.

  - Usage: `userRouter.put('/users/:id', userController.update);`

- `delete(ctx: Router.RouterContext)`: Asynchronously deletes a specific instance of the model by its ID in a database transaction. The deleted instance is returned.

  - Usage: `userRouter.delete('/users/:id', userController.delete);`

- `all(ctx: Router.RouterContext)`: Asynchronously fetches all instances of the model. An array of model instances is returned.

  - Usage: `userRouter.get('/users', userController.all);`

- `validateBody(ctx: Router.RouterContext, next: Koa.Next)`: Asynchronously validates the request body against the defined schema.

  - Usage: `userRouter.post('/users', userController.validateBody, userController.create);`

- `cacheEndpoint(ctx: Router.RouterContext, next: Koa.Next)`: Asynchronously caches the response of an endpoint and serves the cached response if available.

  - Usage: `userRouter.get('/users', userController.cacheEndpoint, userController.all);`

- `getMetadata(ctx: Router.RouterContext)`: Asynchronously obtains metadata of a Sequelize model.

  - Usage: `userRouter.get('/users/metadata', userController.getMetadata);`

- `options(ctx: Router.RouterContext, next: () => Promise<any>)`: Provides the OPTIONS endpoint, enumerating all possible methods on the endpoint.
  - Usage: `userRouter.options('/users', userController.options);`

#

## **Advanced Usage**

You can also add your own logic in the controller by extending the `SyController` class.

```javascript
class UserController extends SyController {
  constructor(options) {
    super(options);
    // Add custom logic here
  }
}
```

## License

MIT

---
