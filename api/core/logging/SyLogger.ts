import pino, { LoggerOptions, Logger, Level } from 'pino';
import { LoggerDefaults } from './defaults';
import { CentralLoggerConfig, LoggerConfig, LoggerControlOptions } from './types';

// Swap to more dynamic log
class CentralLogger {
  private static instance: CentralLogger | null = null;
  private loggers: { [name: string]: LoggerControlOptions } = {};
  private defaultLevel: Level = 'trace';

  private constructor(private config: CentralLoggerConfig = LoggerDefaults) {
    this.initLoggers();
  }

  private initLoggers() {
    for (const name in this.config) {
      if (this.config[name]) {
        this.loggers[name] = {
          isEnabled: true,
          logger: this.createLogger(this.config[name]),
        };
      }
    }
  }

  private createLogger(config: LoggerConfig): Logger {
    const options: LoggerOptions = {
      name: config.name,
      level: config.level || this.defaultLevel,
      timestamp: pino.stdTimeFunctions.isoTime,
      serializers: pino.stdSerializers,
    };

    let logger: Logger;
    if (config.streams && config.streams.length > 0) {
      const transports = config.streams.map((stream) => pino.transport(stream));
      logger =
        transports.length > 1
          ? pino(options, pino.multistream(transports))
          : pino(options, transports[0]);
    } else {
      logger = pino(options);
    }

    return logger;
  }

  public fatal(message: string, obj?: object): void {
    this.log('error', 'fatal', message, obj);
    // this.log('app', 'fatal', message, obj);
  }

  public error(message: string, obj?: object): void {
    this.log('error', 'error', message, obj);
    // this.log('app', 'error', message, obj);
  }

  public warn(message: string, obj?: object): void {
    this.log('error', 'warn', message, obj);
    // this.log('app', 'warn', message, obj);
  }

  public audit(message: string, obj?: object): void {
    this.log('audit', 'info', message, obj);
    // this.log('app', 'audit', message, obj);
  }

  public access(message: string, obj?: object): void {
    this.log('access', 'info', message, obj);
  }

  public query(message: string, obj?: object): void {
    this.log('query', 'info', message, obj);
  }

  public info(message: string, obj?: object): void {
    this.log('app', 'info', message, obj);
  }

  public debug(message: string, obj?: object): void {
    this.log('app', 'debug', message, obj);
  }

  public trace(message: string, obj?: object): void {
    this.log('app', 'trace', message, obj);
  }

  public log(name: string, level: Level, message: string, obj?: object): void {
    const loggerControl = this.loggers[name];

    if (!loggerControl) {
      throw new Error(`Logger ${name} not found.`);
    }

    if (!loggerControl.isEnabled) {
      return;
    }

    const logger = loggerControl.logger;
    if (logger[level]) {
      logger[level](obj || {}, message);
    } else {
      throw new Error(`Logger level "${level}" not supported.`);
    }
  }

  public disableLogger(name?: string) {
    if (name) {
      const loggerControl = this.loggers[name];
      if (loggerControl) {
        loggerControl.isEnabled = false;
      }
    } else {
      for (const key in this.loggers) {
        this.loggers[key].isEnabled = false;
      }
    }
  }

  public enableLogger(name?: string) {
    if (name) {
      const loggerControl = this.loggers[name];
      if (loggerControl) {
        loggerControl.isEnabled = true;
      }
    } else {
      for (const key in this.loggers) {
        this.loggers[key].isEnabled = true;
      }
    }
  }

  public getLogger(name: string): Logger | null {
    const loggerControl = this.loggers[name];
    return loggerControl ? loggerControl.logger : null;
  }

  public listLoggers(): string[] {
    return Object.keys(this.loggers);
  }

  public static getInstance(): CentralLogger {
    if (!this.instance) {
      this.instance = new CentralLogger();
    }
    return this.instance;
  }
}

export default CentralLogger;
