# SyDeleteMixin Class

The `SyDeleteMixin` class, a part of our advanced system, extends the `SyMixin` class. It's designed to provide comprehensive and extendable deletion functionalities. This includes soft deletion, hard deletion, and bulk deletion of model instances. Additionally, it supports a two-step deletion process: first soft deletion, followed by hard deletion.

## Soft Deletion

The `softDelete` method takes in a context object from Koa and a Sequelize transaction object to mark a specific model instance as deleted without removing it from the database.

### Example Usage

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const app = new Koa();
const router = new Router();

router.delete('/softDelete/:id', async (ctx) => {
  const transaction = await sequelize.transaction();
  try {
    await syDeleteMixin.softDelete(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

app.use(router.routes()).use(router.allowedMethods());
```

In this example, replace `syDeleteMixin` with an instance of your `SyDeleteMixin` class and `sequelize` with your Sequelize instance.

## Hard Deletion

The `delete` method permanently removes a specific model instance from the database.

### Example Usage

```javascript
router.delete('/delete/:id', async (ctx) => {
  const transaction = await sequelize.transaction();
  try {
    await syDeleteMixin.delete(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
```

## Bulk Soft Deletion

The `bulkSoftDelete` method allows for soft deleting multiple model instances at once.

### Example Usage

```javascript
router.delete('/bulkSoftDelete', async (ctx) => {
  const transaction = await sequelize.transaction();
  try {
    await syDeleteMixin.bulkSoftDelete(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
```

## Bulk Hard Deletion

The `bulkDelete` method allows for permanently deleting multiple model instances at once.

### Example Usage

```javascript
router.delete('/bulkDelete', async (ctx) => {
  const transaction = await sequelize.transaction();
  try {
    await syDeleteMixin.bulkDelete(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
```

## Archiving

The `archive` method marks a specific model instance as archived, without deleting it from the database.

### Example Usage

```javascript
router.put('/archive/:id', async (ctx) => {
  const transaction = await sequelize.transaction();
  try {
    await syDeleteMixin.archive(ctx, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
```
