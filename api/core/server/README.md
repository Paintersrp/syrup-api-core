```markdown
# SyServer

The SyServer class is a powerful server application based on Koa. It's designed to simplify server initialization and various operations like logging, middleware & route initialization, session configuration, and server-side rendering. Moreover, it handles uncaught exceptions with a graceful shutdown approach. The server seamlessly integrates with cache operations via LFU or LRU cache and ORM database interactions.

## Table of Contents

1. [Usage](#usage)
2. [API](#api)
   - [SyServer](#syserver)
     - [constructor](#constructor)
     - [start](#start)
   - [SyServerOptions](#syserveroptions)
3. [Contributing](#contributing)
4. [License](#license)
```

## Usage

Here are some basic and advanced usage examples for SyServer:

```javascript
import { SyServer } from 'syserver';
import { SyLFUCache } from 'sylfucache';
import { SyDatabase } from 'sydatabase';
import pino from 'pino';

// Initialize dependencies
const cache = new SyLFUCache();
const ORM = new SyDatabase();

// Initialize logger
const logger = pino();

// Initialize Koa app
const app = new Koa();

// Initialize server
const server = new SyServer({
  app,
  port: 3000,
  logger,
  cache,
  ORM,
});
```

### Using SyServer with custom logger and middleware

```javascript
import { SyServer } from 'syserver';
import { SyLFUCache } from 'sylfucache';
import { SyDatabase } from 'sydatabase';
import winston from 'winston';
import session from 'koa-session';

// Initialize dependencies
const cache = new SyLFUCache();
const ORM = new SyDatabase();

// Initialize custom logger
const logger = winston.createLogger({
  /* configuration */
});

// Initialize Koa app
const app = new Koa();

// Initialize middleware
const middleware = session({ key: 'syrup:sess' }, app);

// Initialize server with custom logger and middleware
const server = new SyServer({
  app,
  port: 3000,
  logger,
  cache,
  ORM,
  middleware,
});
```

#

## API

#

### SyServer

#### `constructor()`

Creates a new SyServer instance.

```javascript
new SyServer(options: SyServerOptions)
```

**Parameters:**

- `options` <[SyServerOptions](#syserveroptions)> - Server configuration options.

#

#### `start()`

Starts the server by initializing the database and cache, and starting the HTTP server to listen on the specified port.

```javascript
SyServer.start();
```

#

### `SyServerOptions`

Server configuration options.

**Properties:**

- `app` <Koa> - Koa application instance.
- `port` <Number> - Port on which the server listens for incoming connections.
- `logger` <[Logger](https://getpino.io/#/docs/api?id=logger)> - Logger instance used for logging server-related information.
- `cache` <SyLFUCache | SyLRUCache> - Cache implementation used for server caching.
- `ORM` <SyDatabase> - Database connection instance used for server database operations.
- `resourceThresholds` <ResourceThresholds> (optional) - Resource thresholds for health checks.
- `middleware` <ComposedMiddlewares> (optional) - Middleware to apply to the application.
- `version` <String> (optional) - Server version.
- `distPath` <String> (optional) - Distribution path for the frontend build for serving through SSR.

#

## Contributing

For information on contributing to this project, please see our [Contribution Guidelines](./CONTRIBUTING.md).

#

## License

[MIT](https://choosealicense.com/licenses/mit/)
