import { EventEmitter } from 'events';
import { StreamNotFoundError } from '../errors/server';
import { StreamResponses } from '../lib/responses/stream';
import { DataStream } from './DataStream';

/**
 * StreamManager class serves as a singleton manager for all data streams.
 * It provides functionalities to add, remove, start, stop, and fetch streams.
 * This class extends EventEmitter to allow for event-based communication.
 */
export class StreamManager extends EventEmitter {
  private static instance: StreamManager;
  private streams: Record<string, DataStream> = {};

  private constructor() {
    super();
  }

  /**
   * Provides access to the singleton instance of the StreamManager.
   * @returns {StreamManager} The singleton instance of the StreamManager.
   */
  public static getInstance(): StreamManager {
    if (!StreamManager.instance) {
      StreamManager.instance = new StreamManager();
    }
    return StreamManager.instance;
  }

  /**
   * Adds a new data stream to the manager.
   * @param {string} name - The name of the data stream.
   * @param {DataStream} stream - The data stream to be added.
   */
  public addStream(name: string, stream: DataStream): void {
    if (this.streams[name]) {
      console.warn(StreamResponses.STREAM_ALREADY_EXISTS(name));
      return;
    }

    this.streams[name] = stream;
    this.emit('streamAdded', name);
  }

  /**
   * Removes a data stream from the manager.
   * @param {string} name - The name of the data stream to be removed.
   */
  public removeStream(name: string): void {
    if (!this.streams[name]) {
      console.warn(StreamResponses.STREAM_NOT_FOUND(name));
      return;
    }

    delete this.streams[name];
    this.emit('streamRemoved', name);
  }

  /**
   * Fetches a data stream from the manager.
   * @param {string} name - The name of the data stream.
   * @returns {DataStream | undefined} The data stream if found, undefined otherwise.
   */
  public getStream(name: string): DataStream | undefined {
    return this.streams[name];
  }

  /**
   * Checks if a data stream exists in the manager.
   * @param {string} name - The name of the data stream.
   * @returns {boolean} True if the data stream exists, false otherwise.
   */
  public hasStream(name: string): boolean {
    return !!this.streams[name];
  }

  /**
   * Starts a data stream.
   * @param {string} name - The name of the data stream to be started.
   */
  public async startStream(name: string): Promise<void> {
    const stream = this.getStream(name);

    if (!stream) {
      throw new StreamNotFoundError(StreamResponses.STREAM_NOT_FOUND(name));
    }

    if (!stream.isActive) {
      await stream.start();
      this.emit('streamStarted', stream.name);
    }
  }

  /**
   * Stops a data stream.
   * @param {string} name - The name of the data stream to be stopped.
   */
  public async stopStream(name: string): Promise<void> {
    const stream = this.getStream(name);

    if (!stream) {
      throw new StreamNotFoundError(StreamResponses.STREAM_NOT_FOUND(name));
    }

    if (stream.isActive) {
      await stream.stop();
      this.emit('streamStopped', stream.name);
    }
  }

  /**
   * Starts all data streams managed by the StreamManager.
   */
  public async startAll(): Promise<void> {
    for (const stream of Object.values(this.streams)) {
      if (!stream.isActive) {
        await stream.start();
        this.emit('streamStarted', stream.name);
      }
    }
  }

  /**
   * Stops all data streams managed by the StreamManager.
   */
  public async stopAll(): Promise<void> {
    for (const stream of Object.values(this.streams)) {
      if (stream.isActive) {
        await stream.stop();
        this.emit('streamStopped', stream.name);
      }
    }
  }
}
