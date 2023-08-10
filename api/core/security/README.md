# SecurityService Module

## Overview

The `SecurityService` module provides comprehensive security-related tasks for your application. It includes methods for 2FA token generation and verification, encryption and decryption using AES-256-GCM, and secure random token generation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the `SecurityService` module into your project by cloning the repository or downloading the module.

```bash
git clone <repository-url>
```

Make sure to install the required dependencies:

```bash
npm install crypto speakeasy qrcode
```

## Usage

Import the `SecurityService` class into your code and utilize its static methods for various security tasks.

```typescript
import { SecurityService } from './path/to/SecurityService';

const secret = SecurityService.generate2FASecret();
const qrCode = await SecurityService.generate2FAQrCode(secret);
const isValid = SecurityService.verify2FAToken(secret, 'user-token');
```

## Methods

- **generate2FASecret()**: Generates a 2FA secret.
- **generate2FAQrCode(secret: string)**: Generates a QR code for a 2FA secret.
- **verify2FAToken(secret: string, token: string)**: Verifies a 2FA token.
- **encrypt(data: string, key: Buffer)**: Encrypts data using AES-256-GCM.
- **decrypt(data: string, key: Buffer)**: Decrypts data using AES-256-GCM.
- **generateSecureRandomToken(length?: number)**: Generates a secure random token.

## Contributing

Contributions to the `SecurityService` module are welcome. Please submit a pull request or open an issue to discuss proposed changes.

## License

[MIT License](LICENSE)

---
