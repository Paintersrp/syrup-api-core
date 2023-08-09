<div align="center">

# 📊 Syrup ReportManager

An integral part of the Syrup framework that efficiently manages, schedules, and controls report profiles.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![API Documentation](https://img.shields.io/badge/documentation-no-red.svg)

</div>

## 🏁 Table of Contents

1. [About Syrup ReportManager](#about-syrup-reportmanager)
2. [🎯 Key Features](#key-features)
3. [🏃‍♂️ Getting Started](#getting-started)
4. [📘 API Documentation](#api-documentation)
5. [🔁 Usage Scenarios](#usage-scenarios)
6. [🙌 Contributing](#contributing)
7. [⚖️ License](#license)
8. [📧 Contact](#contact)

## 📕 About Syrup ReportManager <a name="about-syrup-reportmanager"></a>

Syrup's `ReportManager` module provides a robust solution for managing a collection of report profiles in a Node.js environment. Each profile is associated with a job, scheduled to run at specified intervals, thereby automating the report generation process. As part of the larger Syrup framework, `ReportManager` integrates seamlessly with other components, offering a comprehensive toolset for application development and management.

## 🎯 Key Features <a name="key-features"></a>

- Efficient management of multiple report profiles.
- Scheduling of report generation jobs.
- Fine-grained control of reports with start, stop, and reschedule capabilities.
- Dynamic addition and removal of report profiles.
- Built for integration with the Syrup framework.

## 🏃‍♂️ Getting Started <a name="getting-started"></a>

```typescript
// Create an instance with your report profiles
const manager = new ReportManager(reportProfiles);

// Start a report
manager.startReport('reportName');
```

## 📘 API Documentation <a name="api-documentation"></a>

### `ReportManager` Class

The `ReportManager` class is responsible for managing and scheduling report profiles. Each report profile is associated with a job that runs at a certain time.

#### Constructor

```typescript
constructor(reportProfiles: ReportProfile[])
```

Creates a new `ReportManager` instance. It takes an array of `ReportProfile` objects as an argument.

#### `startReport(name: string): void`

Starts a report. Takes the name of the report to be started as an argument.

#### `stopReport(name: string): void`

Stops a report. Takes the name of the report to be stopped as an argument.

#### `rescheduleReport(name: string, schedule: string): void`

Reschedules a report. Takes the name of the report to be rescheduled and the new schedule as arguments.

#### `addReportProfile(profile: ReportProfile): void`

Adds a report profile. Takes a `ReportProfile` object as an argument.

#### `removeReportProfile(name: string): void`

Removes a report profile. Takes the name of the report profile to be removed as an argument.

## `ReportProfile` Interface

The `ReportProfile` interface represents the configuration for a report.

```typescript
interface ReportProfile {
  generator: any; // An instance of the generator responsible for generating the report
  schedule: string; // The schedule on which the report should be generated
  name: string; // The unique name of the report
  hooks?: JobHooks; // Optional hooks for the job
}
```

#### `generator: any`

This property holds the generator responsible for generating the report. It could be any object with a method for generating reports.

#### `schedule: string`

This property defines the schedule on which the report should be generated. It should be a string in a format accepted by the job scheduler.

#### `name: string`

This property holds the unique name of the report.

#### `hooks?: JobHooks`

This optional property holds the hooks for the job. It should be an object conforming to the `JobHooks` interface.

## `JobHooks` Interface

The `JobHooks` interface represents the hooks that can be attached to a job. All hooks are optional and are called at different stages of the job's lifecycle.

```typescript
interface JobHooks {
  onInitialize?: () => void; // Called when the job is initialized
  onStart?: () => void; // Called when the job is started
  onComplete?: () => void; // Called when the job is completed
  onError?: (error: Error) => void; // Called when an error occurs during the job execution
}
```

#### `onInitialize?: () => void`

This optional hook is called when the job is initialized.

#### `onStart?: () => void`

This optional hook is called when the job is started.

#### `onComplete?: () => void`

This optional hook is called when the job is completed.

#### `onError?: (error: Error) => void`

This optional hook is called when an error occurs during the job execution. It receives the error as a parameter.

## 🔁 Usage Scenarios <a name="usage-scenarios"></a>

`ReportManager` is perfect for:

- Large-scale applications where reports are generated periodically.
- Systems that require dynamic control over the report generation process.
- Scenarios that need an automated, scheduled approach to report generation.

## 🙌 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## ⚖️ License <a name="license"></a>

This project is licensed under the MIT License.

## 📧 Contact <a name="contact"></a>

Steven Painter – paintersrp@gmail.com

---
