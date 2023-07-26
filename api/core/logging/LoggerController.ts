import pino, { Level, Logger, LoggerOptions } from 'pino';
import { LoggerControllerConfig } from './types';

/**
 * LoggerController encapsulates the Logger instance and controls its behavior.
 */
export class LoggerController {
  public readonly defaultLevel: Level = 'trace';
  public readonly logger: Logger;

  public verbose: boolean;
  public isEnabled: boolean;

  /**
   * Creates a new LoggerController.
   * @param {LoggerControllerConfig} config - The logger configuration.
   * @param {boolean} [isEnabled=true] - The status of the logger (enabled/disabled).
   */
  constructor(config: LoggerControllerConfig, isEnabled: boolean = true) {
    this.logger = this.createLogger(config);
    this.verbose = config.verbose || true;

    this.isEnabled = isEnabled;
  }

  /**
   * Creates a new logger instance.
   * @private
   * @param {LoggerControllerConfig} config - The logger configuration.
   * @returns {Logger} - A logger instance.
   */
  private createLogger(config: LoggerControllerConfig): Logger {
    const options: LoggerOptions = {
      name: config.name,
      level: config.level || this.defaultLevel,
      timestamp: pino.stdTimeFunctions.isoTime,
      serializers: pino.stdSerializers,
    };

    let streams = config.streams ? [...config.streams] : [];
    if (config.verbose) {
      streams.push({ target: 'pino-pretty' });
    }

    const transports = streams.map((stream) => pino.transport(stream));
    return transports.length > 1
      ? pino(options, pino.multistream(transports))
      : pino(options, transports[0]);
  }

  /**
   * Disables the logger.
   * @public
   */
  public disable(): void {
    this.isEnabled = false;
  }

  /**
   * Enables the logger.
   * @public
   */
  public enable(): void {
    this.isEnabled = true;
  }
}
