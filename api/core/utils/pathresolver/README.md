<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PathResolver</title>
</head>
<body>

<h1 align="center">PathResolver</h1>
<p align="center">
  <strong>A Comprehensive Path Management Solution for Node.js</strong>
</p>

<div align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</div>

## <a name="overview"></a>Overview

PathResolver simplifies path management by providing a powerful interface to define, resolve, and validate complex path structures. Whether you are handling a small project or a large-scale application, PathResolver ensures consistency and efficiency in path handling.

## <a name="features"></a>Features

- **Structured Path Management:** Define paths in a hierarchical structure.
- **Customizable Resolution:** Extend functionality with custom resolver functions.
- **Path Validation:** Validate paths to ensure existence.
- **Directory Creation:** Automatically create directories if they don't exist.
- **TypeScript Support:** Strongly typed with TypeScript definitions.

## <a name="installation"></a>Installation

```bash
npm install path-resolver
# OR
yarn add path-resolver
```

## <a name="usage"></a>Usage

### Basic Usage

```typescript
import { PathResolver } from 'path-resolver';

const structure = {
  src: null,
  build: null,
};

const resolver = new PathResolver('/my/project', structure);
console.log(resolver.paths); // Outputs the resolved paths
```

### Advanced Usage

```typescript
// ...
```

## <a name="api-reference"></a>API Reference

### `PathResolver` Class

#### Constructor

```typescript
constructor(
  basePath: string,
  structure: T,
  resolverFunction?: PathResolverFunction,
  validatePaths?: boolean
)
```

- `basePath`: Base path for resolving paths.
- `structure`: The structure representing the paths.
- `resolverFunction`: Optional custom function to resolve paths.
- `validatePaths`: Optional flag to validate if paths exist. Default is `false`.

#### Methods

- **`paths`** (getter): Returns the resolved structure of paths.
- **`getPath(key: keyof T): PathType`**: Retrieves the resolved path by key.
- **`setPath(key: keyof T, value: string)`**: Sets a path value by key.
- **`ensureDirectories()`**: Ensures that all directories in the paths exist, creating them if necessary.

## <a name="contributing"></a>Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## <a name="license"></a>License

Licensed under the MIT License. See [LICENSE](./LICENSE) for details.

</body>
</html>
