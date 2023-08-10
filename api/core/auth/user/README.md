# UserService Module

## Overview

The `UserService` module offers comprehensive user management functionalities for your application. It includes methods for finding users, handling passwords and sessions, and managing user information.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the `UserService` module into your project by cloning the repository or downloading the module.

```bash
git clone <repository-url>
```

Make sure to install the required dependencies:

```bash
npm install bcrypt
```

## Usage

Import the `UserService` class into your code and utilize its methods for various user management tasks.

```typescript
import { UserService } from './path/to/UserService';

const user = await UserService.getByUsername('JohnDoe');
const isValid = await UserService.comparePassword('password', user.password);
```

## Methods

### User Retrieval

- **findByToken(token: string)**: Finds a user by their refresh token.
- **getById(userId: number)**: Retrieves a user by their unique ID.
- **getByUsername(username: string)**: Retrieves a user by their username.

### Password Handling

- **comparePassword(password: string, newPassword: string)**: Compares the given password with the hash.
- **hashPassword(password: string)**: Hashes the given password using bcrypt.
- **updatePassword(userId: number, newPassword: string)**: Updates the password for a user by ID.

### Session Management

- **generateSessionObject(user: User)**: Generates a session object with essential user information.
- **contextRoleResolver(ctx: IRouterContext)**: Returns the user role if found in the context session.

### User Management

- **delete(userId: number)**: Deletes a user by their unique ID.

## Contributing

Contributions to the `UserService` module are welcome. Please submit a pull request or open an issue to discuss proposed changes.

## License

[MIT License](LICENSE)

---
