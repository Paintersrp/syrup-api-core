# ErrorReportGenerator

`ErrorReportGenerator` provides a robust solution for analyzing error logs, categorizing them, and generating detailed reports for further analysis. Built on top of a generic `BaseReportGenerator`, it offers a specialized approach to handle error logs effectively.

## Table of Contents

- [Features](#features)
- [Quickstart](#quickstart)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Analyze Logs](#analyze-logs)
  - [Exporting Reports](#exporting-reports)
- [API](#api)
  - [Methods](#methods)
  - [Metrics](#metrics)

## Features

- **Batched Analysis**: Enhances performance by processing logs in manageable batches.
- **Granular Metrics Collection**: Gathers detailed metrics ranging from user agents to error paths.
- **Intelligent Error Classification**: Uses pattern recognition to automatically classify errors.
- **Severity Assessment**: Assigns severity rankings to errors, aiding in prioritization.
- **Versatile Export Options**: Supports exporting of reports in both JSON and CSV formats.

## Quickstart

```typescript
const reportGen = new ErrorReportGenerator();
const report = await reportGen.analyzeLogs();

console.log(report);
```

## Usage

### Initialization

```typescript
const reportGenerator = new ErrorReportGenerator(/* parameters */);
```

### Analyze Logs

To analyze the logs and generate a report:

```typescript
const report = await reportGenerator.analyzeLogs();
```

### Exporting Reports

You can export the generated report in different formats:

```typescript
reportGenerator.exportReport(report, 'json');
reportGenerator.exportReport(report, 'csv');
```

## API

### Methods

- **analyzeLogs()**: Analyzes the logs and returns a comprehensive report.
- **exportReport(report, format)**: Exports the provided report in the specified format. Supported formats are 'json' and 'csv'.

### Metrics

The generated report contains various metrics:

- **totalErrors**: Total number of errors found.
- **errorCodes**: Count of occurrences per error status code.
- **paths**: Count of occurrences per API endpoint or path.
- **methods**: Count of occurrences per HTTP method.
- **userAgents**: Count of occurrences per user agent.
- **ipAddresses**: Count of occurrences per IP address.
- **errorCountByHour**: Count of errors grouped by hour.
- **errorCountByDay**: Count of errors grouped by day.
- **classifications**: Count of errors based on their classification (e.g., "Timeout Error", "Database Error").
- **severityCounts**: Count of errors based on their severity ranking (e.g., "Low", "Medium", "High", "Critical").

---
