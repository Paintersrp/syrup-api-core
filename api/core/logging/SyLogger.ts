import fs from 'fs-extra';
import path from 'path';
import { promisify } from 'util';

import { Logger, Level } from 'pino';

import { LoggerController } from './LoggerController';
import { LoggerDefaults } from './defaults';
import { LoggerNames } from './enums';
import { LogInterface, SyLoggerConfig } from './types';
import { Interval } from '../lib';
import { DataSize } from '../lib/shared/enums/data-sizes';

/**
 * CentralLogger creates and manages multiple loggers in the system.
 * It follows Singleton pattern, so there is only one instance of CentralLogger.
 */
export class SyLogger {
  private static instance: SyLogger | null = null;
  private loggers: { [name: string]: LoggerController } = {};
  public housekeepingId?: NodeJS.Timeout;

  /**
   * Creates a new SyLogger instance.
   * @param {SyLoggerConfig} [config=LoggerDefaults] - The system logger configuration.
   */
  constructor(private config: SyLoggerConfig = LoggerDefaults) {
    this.initLoggers();
    this.startHousekeeping();
  }

  /**
   * Initializes all loggers as per configuration.
   * @private
   */
  private initLoggers() {
    for (const name in this.config) {
      if (this.config[name]) {
        const config = this.config[name];
        this.loggers[name] = new LoggerController(config);
      }
    }
  }

  /**
   * Logs a fatal message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public fatal(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.ERROR, 'fatal', message, obj);
  }

  /**
   * Logs an error message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public error(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.ERROR, 'error', message, obj);
  }

  /**
   * @public Logs a warning message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public warn(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.ERROR, 'warn', message, obj);
  }

  /**
   * @public Logs an informational message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public info(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.APP, 'info', message, obj);
  }

  /**
   * @public Logs a debug message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public debug(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.APP, 'debug', message, obj);
  }

  /**
   * @public Logs a trace message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public trace(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.APP, 'trace', message, obj);
  }

  /**
   * @public Logs a query message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public logQuery(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.QUERY, 'info', message, obj);
  }

  /**
   * @public Logs an access message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public logAccess(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.ACCESS, 'info', message, obj);
  }

  /**
   * @public Logs an audit message.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public logAudit(message: string, obj?: Record<string, any>) {
    this.log(LoggerNames.AUDIT, 'info', message, obj);
  }

  /**
   * @public Logs a message with a specific log level and name.
   * @param {LoggerNames} name - The name of the logger.
   * @param {Level} level - The log level.
   * @param {string} message - The message to be logged.
   * @param {Record<string, any>} obj - Optional additional information.
   */
  public log(name: LoggerNames, level: Level, message: string, obj?: Record<string, any>): void {
    const loggerControl = this.loggers[name];

    if (!loggerControl) {
      throw new Error(`Logger ${name} not found.`);
    }

    if (!loggerControl.isEnabled) {
      return;
    }

    const logger = loggerControl.logger;

    if (logger[level]) {
      obj ? logger[level]({ message, context: obj }) : logger[level](message);
    } else {
      throw new Error(`Logger level "${level}" not supported.`);
    }
  }

  public batchLog(logs: LogInterface[]): void {
    for (const log of logs) {
      this.log(log.name, log.level, log.message, log.obj);
    }
  }

  /**
   * Disables a specific logger or all loggers if no name is provided.
   * @public
   * @param {string} name - Optional name of the logger.
   */
  public disableLogger(name?: string) {
    if (name) {
      const loggerControl = this.loggers[name];
      if (loggerControl) {
        loggerControl.disable();
      }
    } else {
      for (const key in this.loggers) {
        this.loggers[key].disable();
      }
    }
  }

  /**
   * Enables a specific logger or all loggers if no name is provided.
   * @public
   * @param {string} name - Optional name of the logger.
   */
  public enableLogger(name?: string) {
    if (name) {
      const loggerControl = this.loggers[name];
      if (loggerControl) {
        loggerControl.enable();
      }
    } else {
      for (const key in this.loggers) {
        this.loggers[key].enable();
      }
    }
  }

  /**
   * Fetches a logger instance by name.
   * @public
   * @param {string} name - The name of the logger.
   * @returns {Logger | null} - The logger instance or null if not found.
   */
  public getLogger(name: string): Logger | null {
    const loggerControl = this.loggers[name];
    return loggerControl ? loggerControl.logger : null;
  }

  /**
   * Lists all available loggers.
   * @public
   * @returns {string[]} - The names of all available loggers.
   */
  public listLoggers(): string[] {
    return Object.keys(this.loggers);
  }

  /**
   * Retrieves the singleton instance of SyLogger.
   * @public
   * @returns {SyLogger} - The SyLogger instance.
   */
  public static getInstance(): SyLogger {
    if (!this.instance) {
      this.instance = new SyLogger();
    }
    return this.instance;
  }

  public startHousekeeping(): void {
    console.log('Starting');
    this.housekeepingId = setInterval(() => this.archiveHousekeeping(), Interval.Daily);
  }

  public stopEvictingExpiredItems(): void {
    if (this.housekeepingId) {
      clearInterval(this.housekeepingId);
      this.housekeepingId = undefined;
    }
  }

  private async archiveHousekeeping(): Promise<void> {
    try {
      const files = await fs.readdir('./logs');

      for (const file of files) {
        const filePath = path.join('./logs', file);
        const stats = await fs.stat(filePath);

        if (stats.size > 5 * DataSize.Megabytes) {
          // change this value as per your need
          // create archive directory if not exist
          if (!fs.existsSync('./logs/archive')) {
            await fs.mkdir('./logs/archive');
          }

          // create specific log archive directory if not exist
          const archiveSubDirPath = `./logs/archive/${file.split('.')[0]}`;
          if (!fs.existsSync(archiveSubDirPath)) {
            await fs.mkdir(archiveSubDirPath);
          }

          // Append timestamp to archived log file name
          const archivedFilePath = path.join(
            archiveSubDirPath,
            `${file.split('.')[0]}_${Date.now()}.${file.split('.')[1] || ''}`
          );

          await fs.rename(filePath, archivedFilePath);
        }
      }
    } catch (error) {
      console.error(`Failed to archive old logs: ${error}`);
    }
  }
}
