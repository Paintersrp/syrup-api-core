# SyMetaMixin: Metadata retrieval for Sequelize Models

The `SyMetaMixin` class is a mixin that provides metadata-related functionality for Sequelize models in Koa.js based applications. It extracts metadata about your Sequelize models, such as attributes and associations, and provides them in a more structured and readable format.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Class Methods](#class-methods)
- [Usage](#usage)
  - [Example: Creating a Sequelize model](#example-creating-a-sequelize-model)
  - [Example: Using SyMetaMixin](#example-using-symetamixin)
- [Handling Errors](#handling-errors)
- [Memoization and Performance](#memoization-and-performance)

#

## Configuration

To use `SyMetaMixin`, you first create an instance of it. The constructor requires a configuration object that must match the `ControllerMixinOptions` interface.

```typescript
const mixin = new SyMetaMixin(options);
```

#

## Class Methods

**getMetadata(ctx: Router.RouterContext):** Fetches and structures metadata about the model including its attributes and associations and sets it on the context body.

**getStructuredAttributes(attributes: any):** Structures the model's attributes into a more readable format.

**getStructuredAssociations(associations: any):** Structures the model's associations into a more readable format.

**stringifyDataType(dataType: any):** Converts Sequelize data types into a string format.

#

## Usage

Here are a few examples of how you might use `SyMetaMixin`:

### Example: Creating a Sequelize model

Let's say you have a Sequelize model called 'User' which is defined as:

```typescript
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
```

### Example: Using SyMetaMixin

You can then use the `SyMetaMixin` to get the metadata of this model as follows:

```typescript
import Koa from 'koa';
import Router from 'koa-router';
import { SyMetaMixin } from './SyMetaMixin';

const app = new Koa();
const router = new Router();

router.get('/metadata', async (ctx) => {
  const mixin = new SyMetaMixin({
    model: User,
  });

  try {
    await mixin.getMetadata(ctx);
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
});

app.use(router.routes());

app.listen(3000);
```

Here, when you access the '/metadata' route, it will return a structured response containing the metadata of the 'User' model. If any error occurs during the process, a `BadRequestError` will be thrown, which we catch and handle by sending an appropriate HTTP response.

#

## Handling Errors

The `getMetadata`, `getStructuredAttributes`, and `getStructuredAssociations` methods may throw a `BadRequestError` when they are unable to find the model, its attributes, or its associations. It is recommended to use proper error handling when using these methods to ensure your application can respond to these situations appropriately.

#

## Memoization and Performance

The `stringifyDataType` method uses lodash's `memoize` function to improve performance when dealing with Sequelize data types. By storing the results of expensive function calls and reusing them when the same inputs occur again, the `stringifyDataType` method can greatly increase performance, especially when working with larger datasets.
