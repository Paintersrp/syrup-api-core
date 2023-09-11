import { LoggerNames } from './enums';
import { LoggerConfig } from './types';

export const LoggerDefaults: LoggerConfig = {
  [LoggerNames.APP]: {
    name: LoggerNames.APP,
    level: 'info',
    verbose: true,
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/app.log` },
      },
    ],
  },
  [LoggerNames.REQUEST]: {
    name: LoggerNames.REQUEST,
    level: 'trace',
    verbose: false,
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/requests.log` },
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
    verbose: false,
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
    verbose: false,
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
    verbose: false,
    streams: [
      {
        target: 'pino/file',
        options: { destination: `./logs/access.log` },
      },
    ],
  },
};
