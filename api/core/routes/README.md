# SyRoutes

`SyRoutes` is a powerful, generic class designed to simplify the creation of routes and endpoints for a specific subclass of `SyController` in your Koa-based Node.js applications. By using `SyRoutes`, developers can easily abstract the process of defining standard REST API endpoints that conform to CRUD operations (Create, Read, Update, Delete).

If you are using Sequelize as your ORM and Koa as your web framework, `SyRoutes` would be an excellent tool to consider, thanks to its easy integration and robust features.

**Table of Contents**

- [Features](#features)
- [Usage](#usage)
- [API](#api)
- [SyController Methods](#sycontroller-methods)
- [Support](#support)
- [License](#license)

## Features

- Automatic generation of CRUD routes.
- Validation of request bodies for POST, PUT and PATCH operations.
- Endpoint caching for performance optimization.
- Metadata retrieval for your Sequelize models.
- Option method support for identifying available endpoint operations.

## Usage

First, create an instance of `SyController` (or its subclass) for your Sequelize model. After this, pass it to the `SyRoutes` class constructor along with the route name, the Koa application instance, and optionally, the API version.

Here's an example of how to create routes for a 'users' model:

```typescript
import Koa from 'koa';
import { SyRoutes } from './SyRoutes';
import { UserController } from '../controller/UserController';

const app = new Koa();
const userController = new UserController(app);
const userRoutes = new SyRoutes<UserController>(userController, 'users', app, 'v1');
```

By doing this, you instantly gain access to these endpoints for the 'users' route:

- POST /users: Creates a new user record. Requires request body validation.
- GET /users/:id: Retrieves a specific user record by ID.
- PUT /users/:id: Updates a specific user record by ID. Requires request body validation.
- PATCH /users/:id: Partially updates a specific user record by ID. Requires request body validation.
- DELETE /users/:id: Deletes a specific user record by ID.
- GET /users: Retrieves all user records. Supports pagination, sorting, and filtering.
- GET /meta/users: Retrieves metadata about the user model.
- OPTIONS /users: Retrieves available endpoint option methods.

## API

### `constructor(controller: T, routeName: string, app: Koa, version?: string | number | 'v1')`

The constructor initializes the `SyRoutes` instance.

Parameters:

- `controller`: An instance of `SyController` or its subclass representing a Sequelize model.
- `routeName`: Name of the route.
- `app`: An instance of a Koa application.
- `version`: Optional version of the API.

### `initModelRoutes()`

This method initializes all the routes related to the model.

### `addRoutesToApp(app: Koa)`

This method adds the router routes and allowed methods to the Koa application.

Parameters:

- `app`: The Koa application instance.

### `getRouter(): Router`

This method returns the router instance.

### `getController(): T`

This method returns the controller instance.

## SyController Methods

When creating a subclass of `SyController`, ensure that the subclass implements the following methods as these are used by `SyRoutes` in `initModelRoutes()`:

- `create()`
- `read()`
- `update()`
- `delete()`
- `all()`
- `getMetadata()`
- `options()`
- `validateBody()`
- `cacheEndpoint()`

## Support

If you encounter any issues, have questions, or need further information about `SyRoutes`, please open an issue in the repository or reach out to the repository maintainer.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/), which allows for flexibility in using, copying, modifying, merging, publishing, and distributing the software.
