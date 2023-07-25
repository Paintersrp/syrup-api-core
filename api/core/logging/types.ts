import { Level, Logger, TransportSingleOptions } from 'pino';
import { LoggerNames } from './enums';

export interface LoggerConfig {
  name: LoggerNames;
  level?: Level;
  prettyPrint?: boolean;
  streams?: TransportSingleOptions[];
}

export interface CentralLoggerConfig {
  [name: string]: LoggerConfig;
}

export interface LoggerControlOptions {
  isEnabled: boolean;
  logger: Logger;
}
