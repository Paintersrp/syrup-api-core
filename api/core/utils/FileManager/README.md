<div align="center">
    <h1>FileManager</h1>
    <p>💼 Your Ultimate Solution for File Management in Koa Applications 💼</p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>

</div>

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [API Reference](#api-reference)
6. [Real-World Examples](#real-world-examples)
7. [Contributing](#contributing)
8. [License](#license)
9. [Support](#support)

<div id="introduction"></div>

## 🌟 Introduction

Introducing **FileManager**, a state-of-the-art file management system designed exclusively for Koa applications. FileManager aims to provide developers with a seamless experience in handling file-related operations. With an intuitive and robust API, FileManager is poised to become an indispensable tool in your development toolkit.

Whether you're handling user uploads, managing downloadable resources, or organizing files within your application, FileManager has got you covered.

<div id="features"></div>

## ✨ Features

- **Streamlined File Uploading**: Easily upload single, multiple, or specific field files with full control over the process.
- **Swift File Downloading**: Enable clients to download files effortlessly.
- **Secure File Deletion**: Delete files from the system with confidence and ease.
- **Organized File Listing**: Retrieve file lists from specified directories.
- **Automated File Storage**: Manage file storage and retrieval with minimal code.
- **Flexible Configuration**: Tailor FileManager to your specific needs with customizable options.
- **Type Safety**: Leverage TypeScript for robust, error-free code.
- **Middleware Integration**: Seamlessly integrate FileManager into your Koa routes.

<div id="installation"></div>

## 🚀 Installation

FileManager is just a command away! Install it using npm or yarn:

```bash
npm install file-manager
# or
yarn add file-manager
```

Ensure that you have TypeScript installed, as FileManager leverages strong typing for enhanced development experience.

<div id="quick-start"></div>

## 🏁 Quick Start

Kickstart your file management with FileManager. Here's a quick example to get you going:

```typescript
import { FileManager } from 'file-manager';

const fileManager = new FileManager({
  uploadDir: 'uploads/',
  allowedFileTypes: ['image/png', 'image/jpeg'],
});

// Use fileManager methods in your Koa routes
```

For more detailed examples and usage, head over to the [Real-World Examples](#real-world-examples) section.

<div id="api-reference"></div>

## 📘 API Reference

### Constructor

```typescript
new FileManager(options?: FileManagerOptions): FileManager
```

#### Options

- `uploadDir` (string): The directory for storing uploaded files. Default is `'uploads/'`.
- `allowedFileTypes` (string[]): An array of allowed MIME types.
- `limits` (multer.Limits): The limits of the uploaded data.

### Methods

#### `getSingleFileUploader(fieldName: string)`

Middleware for uploading a single file. Returns a Koa middleware function.

#### `getMultipleFileUploader(fieldName: string, maxCount: number)`

Middleware for uploading multiple files. Returns a Koa middleware function.

#### `getFieldFileUploader(fields: multer.Field[])`

Middleware for uploading files based on specific fields. Returns a Koa middleware function.

#### `downloadFile(filePath: string, ctx: Context): Promise<void>`

Sends a file to the client for download.

#### `deleteFile(filePath: string): Promise<void>`

Deletes a file from the file system.

#### `listFiles(directory?: string): Promise<string[]>`

Lists the files in a given directory.

#### `getFilePath(filename: string, directory?: string): string`

Constructs the file path for a given filename and directory.

#### `storeFile(filename: string, destination?: string): Promise<string>`

Moves a file from the upload directory to a specified destination.

For more detailed API documentation, please visit [this link](LINK_TO_DETAILED_API_DOCS).

<div id="real-world-examples"></div>

## 🌍 Real-World Examples

Explore real-world scenarios with FileManager:

### 1. **User Profile Picture Upload**

Use FileManager to handle user profile picture uploads and provide URLs for retrieval.

```typescript
import { FileManager } from 'file-manager';
import Router from 'koa-router';

const router = new Router();
const fileManager = new FileManager({ uploadDir: 'profile_pics/' });

router.post('/uploadProfilePic', fileManager.getSingleFileUploader('profilePic'), (ctx) => {
  const filePath = fileManager.getFilePath(ctx.file.filename, 'profile_pics/');
  ctx.body = { message: 'Profile picture uploaded successfully', filePath };
});
```

### 2. **Document Management System**

Build a document management system that allows users to upload, download, and organize documents.

```typescript
// Upload Endpoint
router.post('/uploadDocument', fileManager.getSingleFileUploader('document'), (ctx) => {
  const filePath = fileManager.getFilePath(ctx.file.filename);
  ctx.body = { message: 'Document uploaded successfully', filePath };
});

// Download Endpoint
router.get('/downloadDocument/:filename', async (ctx) => {
  const filePath = fileManager.getFilePath(ctx.params.filename);
  await fileManager.downloadFile(filePath, ctx);
});
```

### 3. **Media Library**

Create a media library where users can upload and manage images, videos, and audio files.

```typescript
// Upload Multiple Media Files
router.post('/uploadMedia', fileManager.getMultipleFileUploader('media', 5), (ctx) => {
  const filePaths = ctx.files.map((file) => fileManager.getFilePath(file.filename));
  ctx.body = { message: 'Media files uploaded successfully', filePaths };
});

// List Media Files
router.get('/listMedia', async (ctx) => {
  const files = await fileManager.listFiles('media/');
  ctx.body = { files };
});
```

### 4. **Secure File Deletion**

Allow admins to securely delete files from the server.

```typescript
// Delete Endpoint
router.delete('/deleteFile/:filename', async (ctx) => {
  if (ctx.state.user.isAdmin) {
    // Assuming user's admin status is in state
    const filePath = fileManager.getFilePath(ctx.params.filename);
    await fileManager.deleteFile(filePath);
    ctx.body = { message: 'File deleted successfully' };
  } else {
    ctx.status = 403;
    ctx.body = { message: 'Unauthorized' };
  }
});
```

These examples showcase how FileManager can be used in various scenarios to handle file-related tasks. The methods provided by FileManager make it easy to integrate file operations into Koa routes, providing a streamlined and efficient approach to managing files within your application.

<div id="contributing"></div>

## 🤝 Contributing

Join our community! We welcome contributions of all kinds. See the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

<div id="license"></div>

## 📄 License

FileManager is open-sourced under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as you see fit.-
