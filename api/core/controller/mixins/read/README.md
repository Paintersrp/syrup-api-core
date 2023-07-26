# README.md

---

## Table of Contents

1. [Introduction](#introduction)
2. [Pre-requisites](#pre-requisites)
3. [Usage](#usage)
   - [Basic Usage](#basic-usage)
   - [Advanced Usage](#advanced-usage)
   - [QueryParams and Filter Options](#queryparams-and-filter-options)
4. [API Documentation](#api-documentation)
   - [Classes](#classes)
   - [Interfaces](#interfaces)
5. [Error Handling](#error-handling)
6. [License](#license)

---

## Introduction

Welcome to the repository of the SyReadMixin class, which provides list-related functionality and extends from the base class, SyMixin. This module is designed to simplify database operations with Sequelize models. The main features include retrieving all instances of a model with pagination, sorting, and filtering support, and retrieving a specific instance of the model by its ID.

---

## Pre-requisites

Before you begin, make sure your development environment includes Node.js and npm.

---

## Usage

### Basic Usage

To use the SyReadMixin class, first import it and initialize an instance with your Sequelize model:

```typescript
import { SyReadMixin } from 'your-package';

const readMixin = new SyReadMixin({ model: YourModel });
```

Next, you can use the instance in your Koa router to handle GET requests:

```typescript
router.get('/yourModel', async (ctx: Router.RouterContext) => {
  await readMixin.all(ctx);
});
```

### Advanced Usage

To retrieve a specific instance of a model by its ID, use the `read` method in your Koa router:

```typescript
router.get('/yourModel/:id', async (ctx: Router.RouterContext) => {
  await readMixin.read(ctx);
});
```

### QueryParams and Filter Options

The module supports a wide range of query parameters and advanced filter options. These include pagination (`page`, `pageSize`), sorting (`sort`, `sortOrder`), field selection (`fields`), basic filtering (`filter`, `column`), search (`search`, `searchColumns`), range filtering (`range`, `rangeColumn`), inclusion of related models (`includes`), and advanced filters (`greaterThan`, `lessThan`, `in`, `notIn`, `like`, `notEqual`, `between`).

---

## API Documentation

### Classes

#### SyReadMixin

##### Methods

- `all(ctx: Router.RouterContext)`: Retrieves all instances of the model with pagination, sorting, and filtering support.

- `read(ctx: Router.RouterContext)`: Retrieves a specific instance of the model by its ID.

### Interfaces

#### QueryParams

This interface defines the shape of the query parameters supported by the `all` method.

##### Properties

- `page?: number;`
- `pageSize?: number;`
- `fields?: string;`
- `sort?: string;`
- `sortOrder?: 'asc' | 'desc';`
- `filter?: string;`
- `column?: string;`
- `search?: string;`
- `searchColumns?: string[];`
- `range?: [string, string];`
- `rangeColumn?: string;`
- `includes?: string[];`

#### AdvancedFilterOptions

This interface defines the shape of the advanced filters supported by the `all` method.

##### Properties

- `greaterThan?: string;`
- `lessThan?: string;`
- `in?: string[];`
- `notIn?: string[];`
- `like?: string;`
- `notEqual?: string;`
- `between?: string;`

#### ControllerQueryOptions

This interface extends QueryParams and AdvancedFilterOptions, thereby consolidating all the query options supported by the `all` method.

---

## Error Handling

This module utilizes the Koa error-handling middleware. Errors are thrown and should be handled in your Koa application.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for considering this project. For any questions or feedback, please open an issue on GitHub. We appreciate your input!
