# Anomaly Detector

The Anomaly Detector is a highly sophisticated module designed for the precise identification of anomalies within time-series data. This comprehensive tool utilizes advanced statistical methodologies to recognize any deviation from established norms. Armed with an ability to manage historical data, adapt to observed forecast errors, and apply statistical computations, Anomaly Detector is uniquely positioned to handle datasets characterized by skewed distributions or extreme values.

## Table of Contents

- [Anomaly Detector](#anomaly-detector)
  - [Usage](#usage)
  - [API](#api)
  - [Example](#example)
- [Anomaly Manager](#anomaly-manager)
  - [API](#api-1)
  - [Example](#example-1)
- [Calculator Service](#calculator-service)
  - [Calculator Usage](#calculator-usage)
  - [Calculator Methods](#calculator-methods)
- [History Manager](#history-manager)
  - [History Manager Constructor](#history-manager-constructor)
  - [History Manager Methods](#history-manager-methods)
- [Parameter Service](#parameter-service)
  - [Parameter Service Constructor](#parameter-service-constructor)
  - [Parameter Service Methods](#parameter-service-methods)
  - [Parameter Service Usage](#parameter-service-usage)
- [Persistence Service](#persistence-service)
  - [Persistence Service Methods](#persistence-service-methods)
  - [Persistence Service Usage](#persistence-service-usage)
- [License](#license)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)

## Usage

Create an instance of AnomalyDetector:

```javascript
const detector = new AnomalyDetector(logger, seasonLength, learningRate, zScoreThreshold);
```

Anomaly detection for a specific key-value pair is as simple as:

```javascript
const isAnomaly = await detector.checkAnomaly(key, value);
```

Retrieving historical data, detected anomalies, and comprehensive anomaly data for a particular key are straightforward:

```javascript
const history = detector.getHistory(key);
const anomalies = detector.getAnomalies(key);
const anomalyData = detector.getAnomalyData(key);
```

Persisting or retrieving the historical data from a file can be accomplished with `saveHistory` and `loadHistory` respectively:

```javascript
await detector.saveHistory(fileName);
await detector.loadHistory(fileName);
```

## API

- `constructor(logger: SyLogger, seasonLength: number, learningRate: number, zScoreThreshold: number)` - Initializes an instance of AnomalyDetector.
- `async checkAnomaly(key: string, value: number): Promise<boolean>` - Checks for anomaly for a specific key-value pair.
- `getAnomalies(key: string): Anomaly[] | undefined` - Retrieves the anomalies related to a specific key.
- `getAllAnomalies(): AnomalyRecords` - Retrieves all anomalies across all keys.
- `getHistory(key: string): Anomaly[] | null` - Retrieves the history for a specific key.
- `getHistoryMap(): AnomalyMap` - Retrieves the entire history map.
- `async saveHistory(fileName: string)` - Saves the history to a file.
- `async loadHistory(fileName: string)` - Loads the history from a file.
- `getAnomalyData(key: string): AnomalyStatisticsModified[]` - Retrieves the anomaly data for a specific key.

## Example

Let's take a hypothetical scenario where we are monitoring server response times and wish to identify any anomalies. We set the season length as 24 (assuming we're measuring hourly), learning rate to 0.1, and z-score threshold to 3.5 for high sensitivity.

```javascript
const detector = new AnomalyDetector(logger, 24, 0.1, 3.5);

// Use the data collected over time
for (let i = 0; i < serverData.length; i++) {
  const isAnomaly = await detector.checkAnomaly('responseTime', serverData[i]);
  if (isAnomaly) {
    console.warn(`Anomaly detected at index ${i}`);
  }
}

// At the end of the day, we might want to save the historical data
await detector.saveHistory('responseTimeHistory.json');
```

Now, imagine it's the next day and we want to continue monitoring but start with yesterday's history.

```javascript
await detector.loadHistory('responseTimeHistory.json');

// Continue as the previous day
for (let i = 0; i < todaysServerData.length; i++) {
  const isAnomaly = await detector.checkAnomaly('responseTime', todaysServerData[i]);
  if (isAnomaly) {
    console.warn(`Anomaly detected at index ${i}`);
  }
}
```

## Anomaly Manager

The Anomaly Manager is designed to manage and log anomalies, maintaining a comprehensive log and providing methods to handle and log anomaly check results.

### API

- `AnomalyManager.constructor(logger: SyLogger)` - Constructs a new instance of AnomalyManager.
- `AnomalyManager.initializeAnomalyLogIfNeeded(key: string)` - Checks if an anomaly log exists for a specific key and if not, initializes it.
- `AnomalyManager.handleAnomalies(key: string, value: number, isAnomaly: boolean)` - Handles detected anomalies by adding them to the anomaly log.
- `AnomalyManager.logAnomalies(key: string, stats: AnomalyStatistics | AnomalyStatisticsModified)` - Logs the anomaly check results using the provided statistics.
- `AnomalyManager.getAnomalies(key: string): Anomaly[] | undefined` - Retrieves the anomalies for a specific key.
- `AnomalyManager.getAllAnomalies(): AnomalyRecords` - Retrieves all anomalies across all keys.

### Example

To demonstrate the usage of the AnomalyManager, let's consider an instance where an anomaly is detected using the AnomalyDetector.

```javascript
// Assume detector is an instance of AnomalyDetector and manager is an instance of AnomalyManager

const key = 'responseTime';
const value = 125; // fetched value

const isAnomaly = await detector.checkAnomaly(key, value);

manager.handleAnomalies(key, value, isAnomaly);

if (isAnomaly) {
  const stats = detector.getAnomalyData(key);
  manager.logAnomalies(key, stats);
}
```

## Calculator Service

The `CalculatorService` is a class for managing calculations. It plays an essential role in performing calculations necessary for anomaly detection. It's used to calculate the forecast for a specific key based on historical data, calculate absolute error, mean, standard deviation, z-score, modified z-score, whether a value is an anomaly or not, and more.

### Calculator Usage

To create a new instance of `CalculatorService`, you need to provide the length of the season and the z-score threshold. Here's how:

```javascript
const calculatorService = new CalculatorService(seasonLength, zScoreThreshold);
```

### Calculator Methods

The `CalculatorService` class provides several methods, including:

- `calculateForecast(history, alpha, beta, gamma, seasonality)`: This method calculates the forecast for a specific key.

- `calculateError(value, forecast)`: This method calculates the absolute error between a value and its forecast.

- `calculateMean(history)`: This method calculates the mean of the historical values.

- `calculateStandardDeviation(history, mean)`: This method calculates the standard deviation of the historical values.

- `calculateZScore(value, mean, standardDeviation)`: This method calculates the z-score for a value.

- `calculateModifiedZScore(value, median, mad)`: This method calculates the Modified Z-Score for a given value.

- `calculateAnomaly(zScore)`: This method determines if a value is an anomaly based on the z-score.

- `calculateMedian(list)`: This method calculates the median of a list of numbers.

- `calculateMAD(list, median)`: This method calculates the Median Absolute Deviation (MAD) of a list of numbers.

In general, these methods allow for comprehensive statistical analyses and facilitate the detection of anomalies in the data.

## History Manager

The `HistoryManager` class is responsible for initializing, updating, and retrieving the history of anomalies. This class also contains the logic to check if a history already exists for a specific key.

### History Manager Constructor

The `HistoryManager` class constructor accepts a single parameter, `seasonLength`. This represents the length of a season, and is used to determine whether there is sufficient historical data for specific operations. If the history length is less than the `seasonLength`, the `getAndUpdateHistory` method will return null.

```typescript
constructor(seasonLength: number) {
  this.seasonLength = seasonLength;
}
```

### History Manager Methods

- `initializeHistoryIfNeeded(key: string)`: This method checks if a history exists for a given key. If not, it initializes the history for that key. This method does not return anything.

- `updateHistory(itemHistory: Anomaly[] | undefined, value: number)`: This method updates the history for a specific key with a provided value, then retrieves the updated history. It doesn't return anything.

- `getHistory(key: string)`: This method retrieves the history for a specific key. If the history's length is less than or equal to `seasonLength`, the method will return null.

- `getHistoryMap()`: This method retrieves the entire history map, which is of type `AnomalyMap`.

- `setHistoryMap(history: AnomalyMap)`: This method sets the entire history map to a new map. This method doesn't return anything.

Below is a usage example of the `HistoryManager`:

```typescript
const historyManager = new HistoryManager(10);
historyManager.initializeHistoryIfNeeded('key1');

// Assume we have data for updates
let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
data.forEach((value) => historyManager.updateHistory(historyManager.getHistory('key1'), value));

// Print history for 'key1'
console.log(historyManager.getHistory('key1'));

// Retrieve the entire history map
console.log(historyManager.getHistoryMap());
```

The `HistoryManager` class helps to encapsulate the logic for managing the history of anomaly data, making it easier to handle large volumes of data and perform necessary computations.

## Parameter Service

The `ParameterService` is a service class that manages parameters associated with anomaly detection. It stores parameters and seasonality data associated with keys, and provides functionality to initialize, retrieve, and adjust these parameters.

### Parameter Service Constructor

The `ParameterService` class constructor takes in two parameters: `seasonLength` and `learningRate`. `seasonLength` is the length of the season, and `learningRate` is used in adjusting the anomaly detection parameters.

```typescript
constructor(seasonLength: number, learningRate: number) {
  this.parameters = new Map();
  this.seasonality = new Map();

  this.seasonLength = seasonLength;
  this.learningRate = learningRate;
}
```

### Parameter Service Methods

- `initializeParamtersIfNeeded(key: string)`: This method checks if parameters exist for a given key. If not, it initializes the parameters and seasonality data for that key. This method does not return anything.

- `getParameters(key: string)`: This method retrieves the anomaly detection parameters associated with a given key. If no parameters are associated with the key, it returns undefined.

- `getSeasonality(key: string)`: This method retrieves the seasonality data for a given key. If no seasonality data exists for the key, it returns undefined.

- `adjustParameters(key: string, error: number, forecast: number, value: number)`: This method adjusts the parameters `alpha`, `beta`, and `gamma` associated with a given key based on the calculated error, the forecasted value, and the actual value. This method does not return anything.

- `adjustParameter(param: number, gradientVal: number, learningRate: number)`: This private method adjusts a single parameter based on the gradient value and the learning rate. It returns the adjusted parameter value.

### Parameter Service Usage

Here's an example of how you can use `ParameterService`:

```typescript
const parameterService = new ParameterService(10, 0.1);

// Initialize parameters for a key
parameterService.initializeParamtersIfNeeded('key1');

// Print parameters for 'key1'
console.log(parameterService.getParameters('key1'));

// Adjust parameters
parameterService.adjustParameters('key1', 0.05, 100, 105);

// Print adjusted parameters for 'key1'
console.log(parameterService.getParameters('key1'));
```

The `ParameterService` class provides an encapsulated and convenient way to manage parameters for anomaly detection, ensuring that adjustments to parameters are consistent and maintaining the association between keys and their corresponding parameters and seasonality data.

## Persistence Service

The `PersistenceService` is a utility class that provides functionality to persist (save) and retrieve anomaly detection history data. It operates by interacting with the file system to store and load history data.

### Persistence Service Methods

- `saveHistory(fileName: string, history: Map<string, Anomaly[]>): Promise<void>`: This is an asynchronous method that saves the anomaly detection history to a file. It receives two parameters: the filename where the history data will be saved, and the history data itself (a Map where the keys are strings and the values are arrays of `Anomaly`). The method converts the map into an array and then stringifies it for storage. It doesn't return any value.

- `loadHistory(fileName: string): Promise<Map<string, Anomaly[]>>`: This is an asynchronous method that loads the anomaly detection history from a file. It receives the filename from which the history data will be loaded. The method reads the file content, parses it into a JavaScript object, and then transforms it into a Map. If there's any error during file reading or parsing, it logs the error message and returns an empty Map.

### Persistence Service Usage

Here's an example of how you can use `PersistenceService`:

```typescript
const persistenceService = new PersistenceService();

// Save history data
await persistenceService.saveHistory('history.json', historyMap);

// Load history data
const loadedHistory = await persistenceService.loadHistory('history.json');
```

In the example above, `historyMap` is a Map where the keys are strings (could be IDs or names of the anomalies) and the values are arrays of `Anomaly` instances. This map is saved to a file named `history.json`. Then, it loads the history data from the same file.

This service provides a simple way to persist and retrieve anomaly detection history data, which can be useful for maintaining the state of an anomaly detection system across different sessions or for debugging purposes.

---

## License

The Anomaly Detector module is open-source software, licensed under the MIT license.

## Contributing

Community contributions are highly encouraged. We welcome bug reports, feature requests, and any improvements to the existing codebase.

## Disclaimer

This software is provided 'as is', without any warranties or guarantees of any kind. Users are advised to use it at their own discretion.
