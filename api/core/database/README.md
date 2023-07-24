# SyDatabase - Advanced Database Management

SyDatabase is a database management module for Node.js applications, using Sequelize for database operations and pino for logging. This utility handles database health checks, connection retries, query logging, error logging, and can be extended to support features like metrics collection, automated testing, and scalability strategies.

## Table of Contents

1. [Usage](#usage)
2. [API Documentation](#api-documentation)
3. [Testing](#testing)
4. [License](#license)

## Usage

First, import the necessary modules and initialize the SyDatabase class.

```javascript
import { Sequelize } from 'sequelize';
import { Logger } from 'pino';
import { SyDatabase } from 'sydatabase';

const config = {
  dialect: 'sqlite',
  storage: './database.sqlite',
};

const logger = Logger();
const queriesLogger = Logger();

const sydb = new SyDatabase(config, logger, queriesLogger);
```

After initializing, you can use the class methods for different operations.

```javascript
sydb
  .startDatabase()
  .then(() => {
    console.log('Database started');
  })
  .catch((error) => {
    console.error('Failed to start database:', error);
  });

// Register a health check
sydb.registerHealthCheck(async () => {
  // Perform a health check and return the status
  const status = await someHealthCheck();
  return status;
});

// Perform all registered health checks
sydb
  .performHealthChecks()
  .then((result) => {
    console.log('Health check result:', result);
  })
  .catch((error) => {
    console.error('Health check failed:', error);
  });

// Perform a database query
const sql = 'SELECT * FROM table';
const options = {};
const timeout = 5000;
sydb
  .query(sql, options, timeout)
  .then((result) => {
    console.log('Query result:', result);
  })
  .catch((error) => {
    console.error('Query failed:', error);
  });
```

## API Documentation

- **constructor(config: Options, logger: Logger, queriesLogger: Logger)**: Initializes the SyDatabase class with the provided Sequelize configuration and loggers.
- **startDatabase(): Promise<void>**: Initiates the database, performs health checks, starts logging, and handles errors.
- **checkDatabase(): Promise<boolean>**: Checks the database connection status.
- **backupDatabase(): Promise<string | null>**: Backs up the current state of the database. The method varies depending on the database dialect.
- **restoreDatabase(backupPath: string): Promise<boolean>**: Restores the database from a backup.
- **performBulkOperations(operations: Array<Function>): Promise<void>**: Performs bulk operations within a database transaction.
- **query(sql: string, options: any, timeout: number): Promise<any>**: Executes a database query with optional query options and a timeout.
- **explainQuery(sql: string): Promise<any>**: Explains a SQL query so it can be analyzed.
- **registerHealthCheck(check: HealthCheck): void**: Registers a new health check function.
- **performHealthChecks(): Promise<boolean>**: Performs all registered health checks.

## Testing

To run automated tests, use the `testMixin.runAutomatedTests()` method after starting the database.

```javascript
sydb
  .startDatabase()
  .then(() => {
    sydb.testMixin.runAutomatedTests();
  })
  .catch((error) => {
    console.error('Failed to start database or run tests:', error);
  });
```

## License

SyDatabase is licensed under [MIT](LICENSE).

## Contribute

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/your-repo/sydatabase/issues). You can also take a look at the [contributing guide](https://github.com/your-repo/sydatabase/blob/master/CONTRIBUTING.md).
