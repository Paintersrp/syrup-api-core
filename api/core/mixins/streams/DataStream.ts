import { AnomalyDetector } from '../anomaly/AnomlyDetector';

/**
 * The DataStream class provides a base for creating custom data streams.
 * It includes a mechanism to push data into the stream and automatically check for anomalies.
 * @template T The type of the data that the stream handles.
 */
export abstract class DataStream<T = any> {
  protected listeners: Array<(data: T) => void> = [];
  protected _isActive: boolean = false;
  protected anomalyDetector: AnomalyDetector;

  public name: string;

  /**
   * The active state of the stream.
   * @returns true if the stream is active, false otherwise.
   */
  public get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Constructs a new instance of DataStream.
   * @param name The name of the stream.
   * @param anomalyDetector An instance of AnomalyDetector used for checking anomalies in the stream.
   */
  constructor(name: string, anomalyDetector: AnomalyDetector) {
    this.anomalyDetector = anomalyDetector;
    this.name = name;
  }

  /**
   * Pushes data into the stream, notifies all listeners and checks for anomalies.
   * @param data The data to be pushed into the stream.
   */
  public async pushData(data: T): Promise<void> {
    for (const listener of this.listeners) {
      listener(data);
    }

    // Automatically check for anomalies
    if (await this.anomalyDetector.checkAnomaly(this.name, data)) {
      console.warn(`${this.name} anomaly detected:`, data);
    }
  }

  /**
   * Registers a listener that gets called whenever new data is pushed into the stream.
   * @param listener The listener function to be called when new data arrives.
   */
  public onData(listener: (data: T) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Unregisters a listener from the stream.
   * @param listener The listener function to be removed.
   */
  public offData(listener: (data: T) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Starts the data stream. This method must be implemented by subclasses.
   */
  public abstract start(): Promise<void>;

  /**
   * Stops the data stream. This method must be implemented by subclasses.
   */
  public abstract stop(): Promise<void>;
}
