## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Design Decisions](#design-decisions)
- [API Documentation](#api-documentation)
- [Quick Start Guide](#quick-start-guide)
- [Contributing](#contributing)
- [License](#license)

## Overview

`RequestLogAnalyzer` is a class that facilitates the processing and analysis of request logs in a web server context. Its primary responsibility is to parse these logs, perform analysis, and provide valuable insights through the generation of comprehensive reports.

The main objective is to help developers and system administrators understand the characteristics of web traffic, identify trends, spot anomalies, and ultimately support decision-making related to system enhancements, optimization, and troubleshooting.

## Architecture

`RequestLogAnalyzer` is a subclass of the `LogAnalyzer` abstract base class. This design embodies the "is-a" relationship – every `RequestLogAnalyzer` is a `LogAnalyzer`. It allows us to define a standard interface and default behaviors in `LogAnalyzer` that are common to all types of log analyzers. `RequestLogAnalyzer` then extends this base class, adding functionality specific to analyzing request logs.

The `RequestLogAnalyzer` class's primary operations are:

1. **Log Loading & Parsing:** Logs are consumed as an array of `RequestLogObject` instances, each representing a distinct HTTP request event.
2. **Metric Extraction:** The class traverses the loaded logs to derive meaningful metrics. It tracks various parameters like request duration, response size, paths accessed, user agents, and more.
3. **Report Generation:** The extracted metrics are then utilized to generate an analytics report that can provide insights into web traffic behavior and patterns.

The report generation process is modularized into smaller helper methods for better code organization, readability, and testability. Each helper function is designed to handle a specific facet of the report.

## Design Decicisons

1. **Inheritance:** The use of the `LogAnalyzer` base class fosters code reusability and adherence to SOLID principles, particularly the open-closed principle. The `RequestLogAnalyzer` extends `LogAnalyzer` to provide functionality specific to request logs while preserving the interface and behavior defined by the base class.

2. **Encapsulation:** Each function in `RequestLogAnalyzer` adheres to the single responsibility principle. It encapsulates a specific task, enhancing readability, maintainability, and testability of the code.

3. **Data Structures:** Arrays and objects, essential JavaScript data structures, were used extensively for their flexibility and simplicity. Logs are stored as an array of objects, while metrics and reports are also represented as objects for straightforward data manipulation.

4. **Use of TypeScript `Partial` Utility:** The `Partial` utility type enables the generation of partial reports. It ensures resilience to changes in the `RequestLogReport` type—if the type changes, methods can still generate reports with the fields they recognize.

## API Documentation

### `analyzeLogs(): Partial<RequestLogReport>`

Invokes the analysis process on the loaded logs and returns a partial report of the derived metrics.

**Return value:** An object containing various metrics about the loaded logs.

**Throws:** An error if no logs have been loaded.

### `loadLogs(logs: RequestLogObject[]): void`

Loads an array of log objects into the analyzer.

**Parameters:**

- `logs: RequestLogObject[]`: An array of log objects to be analyzed.

### `addLog(log: RequestLogObject): void`

Appends a single log object to the loaded logs.

**Parameters:**

- `log: RequestLogObject`: A log object to add.

## Quick Start Guide

Below are the steps to use the `RequestLogAnalyzer` class:

**Step 1:** Import the `RequestLogAnalyzer` class into your project:

```javascript
import { RequestLogAnalyzer } from './RequestLogAnalyzer';
```

**Step 2:** Initialize an instance of `RequestLogAnalyzer`:

```javascript
const logAnalyzer = new RequestLogAnalyzer();
```

**Step 3:** Load logs into the analyzer either en masse:

```javascript
const logs = [...]; // replace with your logs
logAnalyzer.loadLogs(logs);
```

Or add logs individually:

```javascript
const log = {...}; // replace with your log
logAnalyzer.addLog(log);
```

**Step 4:** Analyze the logs and generate a report:

```javascript
const report = logAnalyzer.analyzeLogs();
console.log(report);
```

You're all set! You can now analyze request logs using `RequestLogAnalyzer`.

## Contributing

If you're interested in contributing, please read our [Contributing Guidelines](./CONTRIBUTING.md) and ensure you understand our Code of Conduct.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
