<div align="center">
    <h1>PageConfig</h1>
    <p>🚀 A Robust Page Configuration Solution for SEO, Open Graph, Twitter Card & SSR 🚀</p>
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

<div id="introduction"></div>

## 🌟 Introduction

**PageConfig** is a cutting-edge library designed to empower developers with the tools to finely tune the SEO, Open Graph, Twitter Card, and data-fetching mechanisms for individual web pages. This library is framework-agnostic, compatible with a wide array of frontend frameworks, and engineered to excel in SSR environments.

<div id="features"></div>

## ✨ Features

- **SEO Management**: Simplify the process of optimizing meta tags, keywords, and descriptions.
- **Open Graph Integration**: Enhance the way your pages are shared on platforms like Facebook.
- **Twitter Card Support**: Customize how your pages appear when tweeted or embedded in Twitter.
- **SSR Data Fetching**: Define custom data-fetching functions for server-side rendering.
- **Fluent API**: Leverage chainable methods to build configurations with ease.
- **Type Safety**: Strongly typed API for TypeScript users.

<div id="installation"></div>

## 🚀 Installation

Use npm or yarn to install the PageConfig package:

```bash
npm install page-config
# or
yarn add page-config
```

<div id="quick-start"></div>

## 🎓 Quick Start

Here's a quick example to get you started:

```typescript
import { PageConfig } from 'page-config';

const config = new PageConfig()
  .setPath('/about')
  .setSEO({ title: 'About Us', description: 'Learn about our team.' })
  .finalize();

// Use config with your SSR framework or HTML template
```

<div id="api-reference"></div>

## 📚 API Reference

### Class: `PageConfig`

#### Methods

- **`setPath(path: string): PageConfig`**
  Define the path for the page. Must be a valid string.

- **`setSEO(seoData: SEOInterface): PageConfig`**
  Set the SEO data for the page, including title, description, and keywords.

- **`setOpenGraph(ogData: OpenGraphInterface): PageConfig`**
  Define Open Graph data to enhance social sharing.

- **`setTwitterCard(twitterCardData: TwitterCardInterface): PageConfig`**
  Configure Twitter Card data for tailored Twitter sharing.

- **`setFetchData(fetchData: Function): PageConfig`**
  Set a custom data-fetching function for SSR.

- **`finalize(): Readonly<PageConfigInterface>`**
  Finalize the configuration and return a read-only object.

For detailed information, including interfaces and types, please refer to the [API documentation](./docs/api.md).

<div id="real-world-examples"></div>

## 🌐 Real-World Examples

1. **E-Commerce Platform**: Optimize product pages with dynamic SEO meta tags and Open Graph images.
2. **Blog Platform**: Enhance blog posts with custom descriptions, keywords, and Twitter Cards.
3. **Corporate Website**: Leverage server-side rendering to fetch and display dynamic content efficiently.

Explore more in the [examples directory](./examples).

<div id="contributing"></div>

## 💻 Contributing

Your contributions are welcome! Please read our [contributing guide](./CONTRIBUTING.md) for guidelines.

<div id="license"></div>

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
