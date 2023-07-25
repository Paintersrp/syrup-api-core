# SyDatabase: Comprehensive Database Management Class

SyDatabase is a robust class for managing interactions between your application and the database. It's built around Sequelize for database operations, uses Pino for logging, and offers features like database health checks, connection retries, query logging, and error logging.

## Table of Contents

- [Installation](#installation)
- [Initialization](#initialization)
- [Usage Examples](#usage-examples)
- [API Documentation](#api-documentation)

## Installation

First, you need to install SyDatabase in your Node.js application. You can import it using:

```javascript
import { SyDatabase } from 'syrup-core-api';
```

## Initialization

You can initialize an instance of SyDatabase like this:

```javascript
import path from 'path';
import { Logger } from 'pino';
import { Options } from 'sequelize';
import { SyDatabase } from 'path-to-sydatabase';

const config: Options = {
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite'),
};

const logger = Logger();
const queriesLogger = Logger();

const database = new SyDatabase(config, logger, queriesLogger);
```

## Usage Examples

You can then use the SyDatabase instance to manage your database operations:

```javascript
// Start the database
await database.startDatabase();

// Check the database connection
const isConnected = await database.checkDatabase();
console.log('Database connected:', isConnected);

// Backup the database
const backupPath = await database.backupDatabase();
console.log('Database backup:', backupPath);

// Restore the database from a backup
const isRestored = await database.restoreDatabase(backupPath);
console.log('Database restored:', isRestored);

// Execute a database query
const results = await database.query('SELECT * FROM users', {}, 5000);
console.log('Query results:', results);
```

## API Documentation

SyDatabase includes several methods for managing your database:

### `constructor(config: Options, logger: Logger, queriesLogger: Logger)`

Initializes a new SyDatabase instance.

- `config`: The configuration options for Sequelize.
- `logger`: The logger instance for general logging.
- `queriesLogger`: The logger instance for query-specific logging.

---

### `async startDatabase()`

Initiates the database, performs health checks, starts logging, and handles errors.

---

### `async checkDatabase()`

Checks the database connection status and returns a boolean indicating the status.

---

### `async backupDatabase()`

Backs up the current state of the database. The method varies depending on the database dialect.

---

### `async restoreDatabase(backupPath: string)`

Restores the database from a backup.

- `backupPath`: The path to the backup file.

---

### `async performBulkOperations(operations: Array<Function>)`

Performs bulk operations within a database transaction.

- `operations`: An array of functions, each representing a database operation.

---

### `async query(sql: string, options: any, timeout: number)`

Executes a database query with optional query options and a timeout.

- `sql`: The SQL query to execute.
- `options`: Optional query options.
- `timeout`: The timeout for the query in milliseconds.

---

### `async compoundQuery(queries: string[])`

Executes a set of SQL queries within a single database transaction.

- `queries`: An array of SQL queries to execute.

---

### `async explainQuery(sql: string)`

Explains a SQL query so it can be analyzed.

- `sql`: The SQL query to explain.

---

### `async upsert(model: string, values: Optional<any, string>)`

Inserts a new record into the specified model, or updates it if it already exists.

- `model`: The model to update.
- `values`: The values to insert or update.

---

### `registerHealthCheck(name: string, check: HealthCheck)`

Registers a new health check function with a given name.

- `name`: The name of the health check function.
- `check`: The health check function to register.

---

### `unregisterHealthCheck(name: string)`

Unregisters a health check function with a given name.

- `name`: The name of the health check function to unregister.

---

### `async performHealthChecks()`

Performs all registered health checks and returns a boolean indicating the health status.

---

### `async performHealthCheck(check: string | HealthCheck)`

Executes a health check function by name or direct and returns a boolean indicating the health status.

- `check`: The name of the health check function or the function itself.

---

### `scheduleHealthChecks(interval: number)`

Schedules health checks at a given interval in milliseconds.

- `interval`: The interval at which to perform health checks, in milliseconds.

---

### `stopScheduledHealthChecks()`

Stops scheduled health checks if they are currently running.
