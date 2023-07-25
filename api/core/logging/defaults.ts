import { LoggerNames } from './enums';
import { CentralLoggerConfig } from './types';

export const LoggerDefaults: CentralLoggerConfig = {
  [LoggerNames.APP]: {
    name: LoggerNames.APP,
    level: 'trace',
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/app.log` },
      },
      {
        target: 'pino-pretty',
      },
    ],
  },
  [LoggerNames.QUERY]: {
    name: LoggerNames.QUERY,
    level: 'info',
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/queries.log` },
      },
      {
        target: 'pino-pretty',
      },
    ],
  },
  [LoggerNames.ERROR]: {
    name: LoggerNames.ERROR,
    level: 'info',
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/errors.log` },
      },
      {
        target: 'pino-pretty',
      },
    ],
  },
  [LoggerNames.AUDIT]: {
    name: LoggerNames.AUDIT,
    level: 'info',
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/audits.log` },
      },
      {
        target: 'pino-pretty',
      },
    ],
  },
  [LoggerNames.ACCESS]: {
    name: LoggerNames.ACCESS,
    level: 'info',
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/access.log` },
      },
      {
        target: 'pino-pretty',
      },
    ],
  },
};
