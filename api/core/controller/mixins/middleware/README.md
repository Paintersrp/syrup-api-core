# README.md

## SyMiddlewareMixin - Advanced Usage and Configuration

The `SyMiddlewareMixin` is a robust, versatile mixin class that extends from the base `SyMixin`. It is designed to streamline request validation and response caching within your Koa.js server applications, handling even bulk operations with finesse.

This class is a critical part of the Koa/Sequelize stack, utilizing the efficiency of Koa.js, a modern web framework for Node.js, alongside the promise-based ORM Sequelize for handling relational databases.

### Table of Contents

1. [Key Features](#key-features)
2. [Usage](#usage)
3. [Configuration Options](#configuration-options)
4. [Methods](#methods)
5. [Contribution](#contribution)

### Key Features

1. **Request Validation**: It uses Yup, a JavaScript schema builder, to define the schema for request bodies. The validation middleware then validates incoming requests based on this schema and throws a `BadRequestError` for invalid requests.

2. **Response Caching**: It provides an intelligent caching mechanism for endpoint responses. This feature checks if a cached response for the endpoint exists and serves it instead of hitting the database again. If a cache is unavailable, it proceeds as normal and caches the new response for future use.

### Usage

Here's a comprehensive guide on how to integrate `SyMiddlewareMixin` into your project:

```javascript
import { SyMiddlewareMixin } from './SyMiddlewareMixin';
import * as Yup from 'yup';

// Define a Yup schema for request validation
const schema = Yup.object({
  name: Yup.string().required(),
  age: Yup.number().required().positive().integer(),
  email: Yup.string().email(),
  dateOfBirth: Yup.date(),
});

// Create an instance of the SyMiddlewareMixin with schema defined
const syMiddlewareMixin = new SyMiddlewareMixin({
  schema,
  // other options...
});

// Use the SyMiddlewareMixin middleware in your Koa routes
router.post(
  '/endpoint',
  syMiddlewareMixin.validateBody,
  syMiddlewareMixin.cacheEndpoint,
  async (ctx) => {
    // Your route handler logic here...
  }
);
```

This creates a new endpoint, '/endpoint', which utilizes both the request validation and response caching features provided by `SyMiddlewareMixin`.

### Configuration Options

When creating an instance of `SyMiddlewareMixin`, you need to provide a `ControllerMixinMiddlewareOptions` object:

```typescript
interface ControllerMixinMiddlewareOptions {
  schema: Yup.ObjectSchema<any>;
  // Include additional configuration options as your project demands...
}
```

#### schema

A Yup object schema for validating request body data. Here, you can define the shape and validation rules of your incoming requests. For example, a typical user signup form may require fields like 'name', 'email', 'password', each having their own validation requirements.

### Methods

#### validateBody(ctx: Router.RouterContext, next: Koa.Next)

This middleware function validates the request body against the defined Yup schema. If the request body does not meet the requirements of the schema, it throws a `BadRequestError`. The error includes a detailed message about what part of the validation failed.

#### cacheEndpoint(ctx: Router.RouterContext, next: Koa.Next)

This middleware function provides response caching functionality. It creates a cache key by concatenating the request method and URL. If a request comes in with the same method and URL and the `skip` query parameter is not set to 'true', it will serve the cached response. If the cache is not available, it will allow the request to proceed as normal and cache the response for future use. The cache has a default expiration time of 60 seconds.

### Contribution

If you have improvements or features you'd like to see added to `SyMiddlewareMixin`, please create an issue or a pull request on our Github repository. All contributions are welcome!

That's all you need to know to leverage the power of `SyMiddlewareMixin` in your Koa.js projects. If you face any issues or need further clarification, feel free to raise an issue on our Github repository. Happy coding!
