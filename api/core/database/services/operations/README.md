# DatabaseOpsService

### Introduction

DatabaseOpsService is a high-level, comprehensive service class offering a suite of functionalities for interacting with your database using the Sequelize ORM in a Koa.js environment. It leverages the power of Sequelize to perform transactional operations, execute raw SQL queries, upsert into a data model, and gain insights on SQL query plans.

### Main Features

1. **Bulk Operations**: Execute an array of operations within a single database transaction. If any operation fails, the transaction is rolled back, ensuring data integrity.
2. **Query Execution**: Perform individual SQL queries, with the ability to include optional query options and a timeout.
3. **Query Explanation**: Understand your SQL query execution plans, perfect for identifying bottlenecks and optimizing performance.
4. **Compound Queries**: Execute multiple SQL queries within a single transaction.
5. **Upsert Data**: Seamlessly insert a new record or update an existing record within a specified model.

### Installation

This is a custom service class, and it's assumed that it's part of a larger Koa.js application. Sequelize must be installed and configured in your project.

### API Reference

#### Initialization

```javascript
const databaseOpsService = new DatabaseOpsService(sequelizeInstance, loggerInstance);
```

- `sequelizeInstance`: An instance of Sequelize class, configured with your database credentials.
- `loggerInstance`: An instance of a logger (like Pino or Winston) for logging purposes.

#### `performBulkOperations(operations: Array<Function>, retries: number = 2): Promise<void>`

Executes multiple operations within a single database transaction, with optional retry attempts.

- `operations`: An array of async functions.
- `retries`: The number of retry attempts for the transaction if it fails. Default is 2.

```javascript
await databaseOpsService.performBulkOperations([asyncTransaction1, asyncTransaction2], 3);
```

#### `query(sql: string, options: any, timeout: number): Promise<any>`

Executes a database query.

- `sql`: Raw SQL string.
- `options`: Sequelize query options.
- `timeout`: Timeout for the query in milliseconds.

```javascript
const result = await databaseOpsService.query(
  'SELECT * FROM users',
  { type: sequelize.QueryTypes.SELECT },
  5000
);
```

#### `explainQuery(sql: string): Promise<any>`

Performs an EXPLAIN SQL query and logs the result.

- `sql`: Raw SQL string.

```javascript
const explanation = await databaseOpsService.explainQuery('SELECT * FROM users');
```

#### `compoundQuery(queries: string[]): Promise<any>`

Executes a set of SQL queries within a single transaction.

- `queries`: An array of raw SQL strings.

```javascript
await databaseOpsService.compoundQuery([
  'UPDATE users SET active = true',
  'DELETE FROM temp_users',
]);
```

#### `upsert(model: string, values: Optional<any, string>): Promise<any>`

Upserts a record into the specified model.

- `model`: The name of the model.
- `values`: The record's values to be upserted.

```javascript
await databaseOpsService.upsert('User', { id: 1, name: 'John Doe', email: 'johndoe@example.com' });
```

### Advanced Example

In the following example, we illustrate a complex transaction scenario where user data needs to be updated across different tables in a coordinated fashion.

```javascript
// Define individual operations
const updateUser = async (transaction) => {
  const sql = 'UPDATE users SET active = true WHERE id = ?';
  const replacements = [1];
  await databaseOpsService.query(sql, { replacements, transaction });
};

const deleteTempUser = async (transaction) => {
  const sql = 'DELETE FROM temp_users WHERE user_id = ?';
  const replacements = [1];
  await databaseOpsService.query(sql, { replacements, transaction });
};

const updateActivityLog = async (transaction) => {
  const sql = 'INSERT INTO activity_log (user_id, activity) VALUES (?, ?)';
  const replacements = [1, 'User activated and temp user removed'];
  await databaseOpsService.query(sql, { replacements, transaction });
};

// Perform operations in a single transaction
try {
  await databaseOpsService.performBulkOperations([updateUser, deleteTempUser, updateActivityLog]);
} catch (error) {
  logger.error('An error occurred during the transaction:', error);
}
```

In this example, if either `updateUser`, `deleteTempUser`, or `updateActivityLog` operations fail, the entire transaction will be rolled back, preventing partial updates and preserving data integrity.
