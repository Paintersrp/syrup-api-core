# UptimeTracker Module Documentation

Table of Contents

- [Introduction](#introduction)
- [Module Components](#module-components)
  - [UptimeTracker Class](#uptimetracker-class)
  - [Scheduler Class](#scheduler-class)
  - [UptimeRecord Class](#uptimerecord-class)
- [Usage Guide](#usage-guide)
  - [UptimeTracker Usage](#uptimetracker-usage)
  - [Scheduler Usage](#scheduler-usage)
  - [UptimeRecord Usage](#uptimerecord-usage)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The UptimeTracker module is a powerful yet simple-to-use utility designed for tracking and reporting on the uptime of various system checks in Node.js applications. Offering detailed insights about uptime ratios, the module supports a comprehensive view of system availability over time.

From tracking database responsiveness to reporting on a web server's uptime, the UptimeTracker is flexible enough to accommodate a broad range of system checks, making it an essential tool in the effective management of system resources.

## Module Components

The UptimeTracker module consists of three main classes:

### UptimeTracker Class

The UptimeTracker is the primary class for managing uptime records of system checks. It provides methods for updating, retrieving, and deleting uptime records. The class can also be configured to auto-update records at specific intervals.

### Scheduler Class

The Scheduler class serves as a utility for creating intervals to run a specific function continuously at a set interval. This class is used within UptimeTracker to manage the auto-update feature.

### UptimeRecord Class

UptimeRecord encapsulates the details of an uptime record for a system check, providing methods for updating the uptime, calculating the uptime ratio, and outputting the record in a relative time string format.

## Usage Guide

### UptimeTracker Usage

#### Importing the UptimeTracker

```js
import { UptimeTracker } from 'uptimetracker';
```

#### Instantiating UptimeTracker

```js
const uptimeTracker = new UptimeTracker();
```

The constructor can take an optional parameter to set an auto-update interval (in milliseconds):

```js
const uptimeTracker = new UptimeTracker(1000); // 1 second
```

#### Updating a Uptime Record

```js
uptimeTracker.updateUptimeRecord('database', Date.now(), true);
```

#### Processing Uptime Change

```js
uptimeTracker.processUptimeChange(true, 'database');
```

#### Getting Uptime

```js
const uptime = uptimeTracker.getUptime('database');
```

#### Getting All Uptimes

```js
const allUptimes = uptimeTracker.getAllUptimes();
```

#### Deleting a Uptime Record

```js
uptimeTracker.deleteUptimeRecord('database');
```

#### Stopping Auto Update

```js
uptimeTracker.stopAutoUpdate();
```

#### Setting Auto Update Interval

```js
uptimeTracker.setAutoUpdateIntervalMs(2000); // 2 seconds
```

### Scheduler Usage

The Scheduler class manages intervals for running a specific function.

#### Importing the Scheduler

```js
import { Scheduler } from 'uptimetracker';
```

#### Starting the Scheduler

```js
const scheduler = new Scheduler(() => {
  // Callback function
}, 1000); // Interval in milliseconds
```

#### Stopping the Scheduler

```js
scheduler.stop();
```

#### Changing the Scheduler Interval

```js
scheduler.changeInterval(2000); // 2 seconds
```

### UptimeRecord Usage

The UptimeRecord class manages the details of an uptime record.

#### Importing the UptimeRecord

```js
import { UptimeRecord } from 'uptimetracker';
```

#### Creating a UptimeRecord

```js
const uptimeRecord = new UptimeRecord(Date.now());
```

#### Updating the UptimeRecord

```js
uptimeRecord.updateUptime(Date.now(), true);
```

## Example

```js
import { UptimeTracker } from 'uptimetracker';

const uptimeTracker = new UptimeTracker(5000); // Auto-update every 5 seconds

// Add some checks
uptimeTracker.updateUptimeRecord('database', Date.now(), true);
uptimeTracker.updateUptimeRecord('webserver', Date.now(), true);

// Get uptime
let uptime = uptimeTracker.getUptime('database');
console.log(`Database uptime: ${uptime}%`);

uptime = uptimeTracker.getUptime('webserver');
console.log(`Webserver uptime: ${uptime}%`);

// Get all uptimes
let allUptimes = uptimeTracker.getAllUptimes();
console.log(allUptimes);
```

## Contributing

We appreciate and welcome any contributions to this project. To contribute, please create a new issue or a pull request on our GitHub page.

## License

The UptimeTracker module is licensed under the MIT License. Please refer to the `LICENSE` file for details.
