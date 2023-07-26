import { Level, TransportSingleOptions } from 'pino';
import { LoggerNames } from './enums';

// export interface LoggerConfig {
//   name: LoggerNames;
//   level?: Level;
//   prettyPrint?: boolean;
//   streams?: TransportSingleOptions[];
// }

export type LoggerControllerConfig = {
  name: LoggerNames;
  level?: Level;
  streams?: TransportSingleOptions[];
  verbose?: boolean;
};

export interface SyLoggerConfig {
  [name: string]: LoggerControllerConfig;
}

export interface LogInterface {
  name: LoggerNames;
  level: Level;
  message: string;
  obj?: Record<string, any>;
}
