import { RequestLogMetrics, ExtendedRequestLogObject } from '../types';

/**
 * Class used to aggregate metrics from a list of logs.
 */
export class RequestMetricsAggregator {
  /**
   * This method collects metrics from a list of logs.
   *
   * @param logs An array of logs to collect metrics from
   * @returns The collected metrics
   */
  public collectMetrics(logs: ExtendedRequestLogObject[]): RequestLogMetrics {
    const { metrics, durations } = logs.reduce(this.reducerFn, {
      metrics: this.initializeMetrics(logs.length),
      durations: [] as number[],
    });

    this.setupBuckets(durations, metrics);
    return metrics;
  }

  /**
   * This is the reducer function used to collect metrics. It takes the current state and a log and returns the new state.
   * The state includes metrics and an array of durations.
   *
   * @param metrics The current metrics
   * @param durations The current array of durations
   * @param log The log to process
   * @returns The new state
   */
  private reducerFn = (
    { metrics, durations }: { metrics: RequestLogMetrics; durations: number[] },
    log: ExtendedRequestLogObject
  ): { metrics: RequestLogMetrics; durations: number[] } => {
    metrics.ipAddresses.set(log.ipAddress, (metrics.ipAddresses.get(log.ipAddress) || 0) + 1);

    metrics.totalResponseSize = this.addIfDefined(metrics.totalResponseSize, log.responseSize);
    [metrics.totalDuration, metrics.longestDuration, metrics.shortestDuration] =
      this.addAndFindMinMaxIfDefined(
        metrics.totalDuration,
        metrics.longestDuration,
        metrics.shortestDuration,
        log.duration
      );

    metrics.errorCount = this.incrementIfDefined(metrics.errorCount, log.error);
    const userId = typeof log.user === 'string' ? log.user : log.user?.username ?? 'Anonymous';
    const status = log.status ?? 0;
    const hour = log.time!.slice(11, 13);

    this.incrementCount(metrics.requestFrequency, hour);
    this.incrementCount(metrics.userIdsCount, userId);
    this.incrementCount(metrics.pathsCount, log.path);
    this.incrementCount(metrics.statusCodesCount, status.toString());
    this.incrementCount(metrics.methodsCount, log.method);
    this.incrementCount(metrics.userAgentsCount, log.userAgent);

    if (!metrics.endpointPerformance[log.path]) {
      metrics.endpointPerformance[log.path] = {
        totalDuration: 0,
        totalResponseSize: 0,
        count: 0,
      };
    }

    const endpointMetrics = metrics.endpointPerformance[log.path];
    endpointMetrics.count += 1;

    endpointMetrics.totalDuration = this.addIfDefined(endpointMetrics.totalDuration, log.duration);
    endpointMetrics.totalResponseSize = this.addIfDefined(
      endpointMetrics.totalResponseSize,
      log.responseSize
    );

    if (log.duration) {
      durations.push(log.duration);
    }

    return { metrics, durations };
  };

  private incrementCount(obj: { [key: string]: number }, key: string, increment = 1): void {
    obj[key] = (obj[key] ?? 0) + increment;
  }

  private addIfDefined(sum: number, addend: number | undefined): number {
    return addend !== undefined ? sum + addend : sum;
  }

  private addAndFindMinMaxIfDefined(
    total: number,
    longest: number,
    shortest: number,
    value: number | undefined
  ): [number, number, number] {
    if (value !== undefined) {
      total += value;
      longest = Math.max(longest, value);
      shortest = Math.min(shortest, value);
    }
    return [total, longest, shortest];
  }

  private incrementIfDefined(sum: number, value: any): number {
    return value !== undefined ? sum + 1 : sum;
  }

  /**
   * This method initializes the metrics object.
   *
   * @param totalRequests The total number of requests
   * @returns The initialized metrics
   */
  private initializeMetrics(totalRequests: number): RequestLogMetrics {
    return {
      totalRequests: totalRequests,
      totalDuration: 0,
      totalResponseSize: 0,
      errorCount: 0,
      shortestDuration: Infinity,
      longestDuration: 0,
      ipAddresses: new Map(),
      requestFrequency: {},
      userIdsCount: {},
      pathsCount: {},
      statusCodesCount: {},
      methodsCount: {},
      userAgentsCount: {},
      endpointPerformance: {},
      responseTimeBuckets: {},
    };
  }

  /**
   * This method sets up buckets for the response times.
   *
   * @param durations An array of durations
   * @param metrics The metrics object
   * @param numBuckets The number of buckets (default is 10)
   */
  private setupBuckets(
    durations: number[],
    metrics: RequestLogMetrics,
    numBuckets: number = 10
  ): void {
    durations.sort((a, b) => a - b);

    const bucketSize = Math.ceil(durations.length / numBuckets);

    for (let i = 0; i < durations.length; i++) {
      const bucketIndex = Math.min(Math.floor(i / bucketSize), numBuckets - 1);
      const bucketName = `${durations[bucketIndex * bucketSize]}-${
        durations[Math.min((bucketIndex + 1) * bucketSize - 1, durations.length - 1)]
      }ms`;
      metrics.responseTimeBuckets[bucketName] = (metrics.responseTimeBuckets[bucketName] || 0) + 1;
    }
  }
}
