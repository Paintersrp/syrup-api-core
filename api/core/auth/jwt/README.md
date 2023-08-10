# JWTAuthService Module

## Overview

The `JWTAuthService` module provides methods for handling JWT authentication within your Koa-based application. It includes functionalities such as signing, verifying, refreshing tokens, and managing blacklisted tokens.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the `JWTAuthService` module into your project by cloning the repository or downloading the module.

```bash
git clone <repository-url>
```

Make sure to install the required dependencies:

```bash
npm install jsonwebtoken
```

## Usage

Import the `JWTAuthService` class into your code and utilize its methods for handling JWT authentication.

```typescript
import { JWTAuthService } from './path/to/JWTAuthService';

const payload = { username: 'user', role: 'admin' };
const token = await JWTAuthService.sign(payload);
const isValid = await JWTAuthService.verify(token);
```

## Methods

### Token Management

- **sign(payload: UserPayload, expiresIn?: string)**: Signs a payload and returns the JWT token.
- **signRefresh(payload: RefreshPayload, expiresIn?: string)**: Signs a refresh payload and returns the JWT token.
- **verify(token: string)**: Verifies a JWT token.
- **decode(token: string)**: Decodes a JWT token without verifying it.
- **refresh(token: string, expiresIn?: string)**: Refreshes a JWT token.

### Token Blacklisting

- **addToBlacklist(token: string)**: Adds a token to the blacklist.
- **isBlacklisted(token: string)**: Checks if a token is blacklisted.

### Role Verification

- **hasRole(token: string, requiredRole: string)**: Checks if a token has a specific role.

### Cookie Management

- **setCookies(ctx: RouterContext, accessToken: string, refreshToken: string)**: Sets authentication cookies.
- **clearCookies(ctx: RouterContext)**: Clears authentication cookies.
- **checkForToken(ctx: RouterContext)**: Checks if the request contains a valid access token.

## Contributing

Contributions to the `JWTAuthService` module are welcome. Please submit a pull request or open an issue to discuss proposed changes.

## License

[MIT License](LICENSE)
