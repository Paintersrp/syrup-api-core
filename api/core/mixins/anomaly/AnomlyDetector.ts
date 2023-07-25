class AnomalyDetector {
  history: { [key: string]: number[] } = {};

  checkAnomaly(key: string, value: number): boolean {
    if (!this.history[key]) this.history[key] = [];

    this.history[key].push(value);
    if (this.history[key].length > 100) this.history[key].shift();

    const mean = this.history[key].reduce((a, b) => a + b) / this.history[key].length;
    const standardDeviation = Math.sqrt(
      this.history[key].map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
        this.history[key].length
    );

    return value < mean - 2 * standardDeviation || value > mean + 2 * standardDeviation;
  }
}

// ...
// const memoryUsage = 1 - freeMemory / totalMemory;
// if (anomalyDetector.checkAnomaly('memoryUsage', memoryUsage)) {
//   notifications.push('Anomaly detected in Memory Usage');
// }
// ...
