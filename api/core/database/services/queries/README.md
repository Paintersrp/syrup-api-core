# README.md

## QueryLogService

The `QueryLogService` class is a utility that provides capabilities for logging various operations in a database. It's a utility that uses Sequelize, a promise-based Node.js ORM for SQL databases, for database operations and the Pino logger for logging operations. The operations that are logged include SQL query execution, unhandled promise rejections, and system interrupt signals (`SIGINT`).

---

### Class Definition

The `QueryLogService` class is defined with three properties:

- `database`: an instance of the Sequelize class, used for executing database operations.
- `logger`: an instance of the `SyLogger` class, used for general logging.
- `queryStartTime`: a map that stores the start time of a query using the query's unique identifier as the key. This map aids in calculating the time a query takes to execute.

The class constructor requires two arguments:

- `database`: an instance of the Sequelize class
- `logger`: an instance of the `SyLogger` class

### Usage

Here is an example of how to use the `QueryLogService`:

```javascript
import { Sequelize } from 'sequelize';
import { SyLogger } from '../../../logging/SyLogger';
import { QueryLogService } from './QueryLogService';

const sequelize = new Sequelize('sqlite::memory:');
const logger = new SyLogger();
const queryLogService = new QueryLogService(sequelize, logger);

queryLogService.startErrorLogging();
queryLogService.startQueryLogging();
```

---

### Class Methods

**startErrorLogging(): void**

Starts the logging of unhandled promise rejections and system interrupt signals (`SIGINT`). Unhandled promise rejections are logged as errors, while `SIGINT` signals lead to the database connection being closed and a log stating that the connection was closed.

**startQueryLogging(): Promise<void>**

Starts the logging of SQL queries. This is achieved by adding a "beforeQuery" and "afterQuery" hook to the Sequelize instance used for database operations. These hooks are executed before and after each SQL query respectively.

**beforeQueryHook(\_: QueryOptions, query: FixedAbstractQuery): void**

A method that gets executed before every SQL query. It records the start time of the query by storing the current time in a Map object using the query's unique identifier as the key.

**afterQueryHook(options: QueryOptions, meta: FixedAbstractQuery): Promise<void>**

A method that gets executed after every SQL query. It calculates the query's execution duration by subtracting the query's start time from the current time. It then logs the query and its execution duration.

**logQuery(options: QueryOptions, meta: FixedAbstractQuery, duration: number): Promise<void>**

Logs the executed query and its duration. If the duration is over 2000ms (as specified in the `DATABASE.SLOW_QUERY_THRESHOLD` setting), a warning is logged, and the query is further analyzed.

**generateLogObject(options: QueryOptions, meta: FixedAbstractQuery, duration: number): QueryLogObject**

Generates a log object based on query options, meta, and duration. The log object contains the following properties:

- `id`: the unique identifier of the query
- `type`: the type of the query
- `modelName`: the name of the Sequelize model that the query was executed on
- `sql`: the executed SQL query
- `duration`: the execution duration of the query

**generateLogString(logObject: QueryLogObject): string**

Generates a log string from a log object. The log string contains information about the type of the query, the model it was executed on, its duration, and the SQL statement itself.

---

This class, as a whole, serves as a utility for providing visibility into database operations. By using it, you can keep track of how your database queries are performing and whether they're causing any potential issues in your application. It's a powerful tool for improving and maintaining the performance and stability of your database operations.
