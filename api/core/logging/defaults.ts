import { LoggerNames } from './enums';
import { SyLoggerConfig } from './types';

export const LoggerDefaults: SyLoggerConfig = {
  [LoggerNames.APP]: {
    name: LoggerNames.APP,
    level: 'trace',
    verbose: true,
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/app.log` },
      },
    ],
  },
  [LoggerNames.QUERY]: {
    name: LoggerNames.QUERY,
    level: 'trace',
    verbose: false,
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/queries.log` },
      },
    ],
  },
  [LoggerNames.ERROR]: {
    name: LoggerNames.ERROR,
    level: 'trace',
    verbose: true,
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/errors.log` },
      },
    ],
  },
  [LoggerNames.AUDIT]: {
    name: LoggerNames.AUDIT,
    level: 'trace',
    verbose: true,
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/audits.log` },
      },
    ],
  },
  [LoggerNames.ACCESS]: {
    name: LoggerNames.ACCESS,
    level: 'trace',
    verbose: true,
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/access.log` },
      },
    ],
  },
};