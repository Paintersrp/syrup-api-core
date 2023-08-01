# Database Recovery Service and Strategy Factory

This repository provides an extensible, robust, and configurable set of classes intended to assist in the backup and restoration of various database types, providing a much-needed abstraction over the diverse command line interfaces and backup/restore procedures of different databases. The primary class is `DatabaseRecoveryService`, which utilizes the Strategy Design Pattern via `StrategyFactory` to generate the appropriate backup and restore operations based on the database dialect.

#

## Features

- **Robust Abstraction**: Simplify the complexities associated with backing up and restoring various types of databases.
- **Extensible Architecture**: With the Strategy Design Pattern, adding support for new databases becomes as simple as extending the `IDatabaseStrategy` interface.
- **Error Handling**: Proper error handling is integral to the codebase, ensuring potential issues during the backup or restore process are properly logged and dealt with.
- **Logging**: Integrated with `SyLogger` for extensive and configurable logging support.

#

## Usage

The `DatabaseRecoveryService` class provides the methods for backing up and restoring a database, while `StrategyFactory` is responsible for creating the appropriate strategy based on the database dialect.

```javascript
import { Sequelize } from 'sequelize';
import { SyLogger } from '../../../logging/SyLogger';
import { DatabaseRecoveryService } from './DatabaseRecoveryService';

// Instantiate Sequelize, SyLogger and the DatabaseRecoveryService
const sequelize = new Sequelize(...); // Database connection
const logger = new SyLogger(...); // Logger instance
const databasePath = 'path/to/database/file'; // Database file path, if applicable

const service = new DatabaseRecoveryService(sequelize, logger, databasePath);

// Perform the backup and restore operations
const backupPath = await service.backupDatabase();
const restoreResult = await service.restoreDatabase(backupPath);
```

#

## Supported Database Dialects

We support the following database dialects via `StrategyFactory`:

- SQLite (`SqliteStrategy`)
- MySQL (`MySqlStrategy`)
- MariaDB (`MySqlStrategy`)
- PostgreSQL (`PostgresStrategy`)
- Microsoft SQL Server (`MsSqlStrategy`)
- Oracle (`OracleStrategy`)
- IBM DB2 (`Db2Strategy`)

#

## Contributing

We welcome contributions of all forms. Please refer to our [Contribution Guide](./CONTRIBUTING.md) for more information on how to participate in our project.

#

## License

This project is open-source and is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
