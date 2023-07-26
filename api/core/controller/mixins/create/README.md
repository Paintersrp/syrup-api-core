## README.md

# SyCreateMixin Class - Creating Instances in Koa with Sequelize

The `SyCreateMixin` class is a mixin that extends from the `SyMixin` class. It provides the functionality to create instances of a model in both single and bulk formats.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
   - [Single Creation](#single-creation)
   - [Bulk Creation](#bulk-creation)
3. [API Documentation](#api-documentation)
   - [Constructor](#constructor)
   - [create](#create)
   - [bulkCreate](#bulkcreate)

## Installation

Make sure you have Node.js and npm installed in your system. Install the necessary dependencies for your project.

```sh
npm install koa-router sequelize
```

Then import the `SyCreateMixin` class into your file.

```js
import { SyCreateMixin } from '<path-to-your-file>';
```

## Usage

### Single Creation

You can create a single instance of the model like this:

```js
const router = new Router();
const transaction = /* your Sequelize transaction */;

router.post('/model', async (ctx) => {
  const instance = new SyCreateMixin(/* options */);
  await instance.create(ctx, transaction);
});
```

### Bulk Creation

You can create multiple instances of the model like this:

```js
const router = new Router();
const transaction = /* your Sequelize transaction */;
const includes = /* associations to include in creation */;

router.post('/models', async (ctx) => {
  const instance = new SyCreateMixin(/* options */);
  await instance.bulkCreate(ctx, transaction, includes);
});
```

## API Documentation

### Constructor

The `SyCreateMixin` constructor takes in an options object, which is used to initiate the mixin class.

```js
new SyCreateMixin(options: ControllerMixinOptions);
```

### create

The `create` method is used to create a new instance of the model. It requires a `ctx` argument, which is the context object from Koa, and a `transaction` argument, which is a Sequelize transaction.

```js
instance.create(ctx: Router.RouterContext, transaction: Transaction);
```

### bulkCreate

The `bulkCreate` method is used to create multiple instances of the model. It requires a `ctx` argument, which is the context object from Koa, a `transaction` argument, which is a Sequelize transaction, and an `includes` argument, which defines associations to include in the creation.

```js
instance.bulkCreate(ctx: Router.RouterContext, transaction: Transaction, includes: any[]);
```

Please ensure that you handle errors and validations as necessary for your use case. Always use proper HTTP response codes for the respective operations.

## Contact

If you have any questions or run into issues, feel free to reach out to our team.
