## Introduction

SyUpdateMixin is a mixin class designed to extend Koa.js's middleware capabilities by providing reusable methods for updating and bulk updating instances of Sequelize models. Built with TypeScript, it provides type safety while embracing the dynamic nature of JavaScript. This mixin class streamlines the process of updating records in a Sequelize-based ORM by simplifying route handlers and abstracting common update operations.

## Prerequisites

Before proceeding, please ensure that you have the following packages installed in your Node.js project:

1. **koa**: This is the core package for your Koa.js application.
2. **koa-router**: A routing middleware for Koa.js.
3. **sequelize**: Sequelize is a promise-based Node.js ORM for SQL databases.
4. **Database Driver**: A database-specific driver that Sequelize uses to interact with your database. Install the appropriate package depending on your SQL database.

Use npm to install these packages:

```bash
npm install koa koa-router sequelize
npm install pg pg-hstore  # if you are using PostgreSQL
```

After installing these packages, you can proceed to import and use the `SyUpdateMixin` class.

```typescript
import { SyUpdateMixin } from '<path to your mixin classes>';
```

## Getting Started

### Step 1: Initialization

To use SyUpdateMixin, start by creating an instance and passing in an object with `ControllerMixinOptions` type. The most important option is the `model`, which is a reference to the Sequelize model that the instance of the mixin class will operate on.

```typescript
import { Sequelize } from 'sequelize';
import { SyUpdateMixin, ControllerMixinOptions } from './sy-update-mixin';

// Initialize sequelize
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres', // Change to your SQL dialect
});

// Define a model
const MyModel = sequelize.define('MyModel', {
  field1: Sequelize.DataTypes.STRING,
  field2: Sequelize.DataTypes.INTEGER,
  // more fields...
});

// Initialize mixin
const options: ControllerMixinOptions = {
  model: MyModel,
  // additional options...
};

const myMixin = new SyUpdateMixin(options);
```

### Step 2: Using in Route Handlers

After initializing the mixin, you can use it in your Koa route handlers. It provides two public methods for updating models: `update` and `bulkUpdate`.

#### `update(ctx: Router.RouterContext, transaction: Transaction): Promise<void>`

The `update` method is used to update a single instance of the model. The method expects an instance of Koa's `RouterContext` and Sequelize's `Transaction` as arguments. The instance to update is identified by an `id` parameter in the request, and the new field values should be present in the request body.

Here is an example of how to use `update` in a Koa route handler:

```typescript
import Router from 'koa-router';

const router = new Router();

router.post('/update/:id', async (ctx, next) => {
  const transaction = await sequelize.transaction();
  try {
    await myMixin.update(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  await next();
});
```

#### `bulkUpdate(ctx: Router.RouterContext, transaction: Transaction): Promise<void>`

The `bulkUpdate` method is used to update multiple instances of the model. This method expects the request body to be an array of objects, with each object containing an `id` field and the new field values.

Here is an example of how to use `bulkUpdate` in a Koa route handler:

```typescript
router.post('/bulk-update', async (ctx, next) => {
  const transaction = await sequelize.transaction();
  try {
    await myMixin.bulkUpdate(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  await next();
});
```

## Full Example

To illustrate the complete usage of SyUpdateMixin, let's consider an example where we are using Sequelize with a PostgreSQL database, and we have a model `MyModel`.

```typescript
import Koa from 'koa';
import Router from 'koa-router';
import { Sequelize } from 'sequelize';
import { SyUpdateMixin, ControllerMixinOptions } from './sy-update-mixin';

// Initialize sequelize
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres',
});

// Define a model
const MyModel = sequelize.define('MyModel', {
  field1: Sequelize.DataTypes.STRING,
  field2: Sequelize.DataTypes.INTEGER,
  // more fields...
});

// Initialize mixin
const options: ControllerMixinOptions = {
  model: MyModel,
  // additional options...
};

const myMixin = new SyUpdateMixin(options);

// Initialize Koa and router
const app = new Koa();
const router = new Router();

// Route handlers
router.post('/update/:id', async (ctx, next) => {
  const transaction = await sequelize.transaction();
  try {
    await myMixin.update(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  await next();
});

router.post('/bulk-update', async (ctx, next) => {
  const transaction = await sequelize.transaction();
  try {
    await myMixin.bulkUpdate(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  await next();
});

// Apply routes to the app
app.use(router.routes()).use(router.allowedMethods());

// Start server
app.listen(3000);
```
