import pino from 'pino';

const logConfig = {
  level: 'trace',
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: pino.stdSerializers,
};

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `./logs/app.log` },
});

const consoleTransport = pino.transport({
  target: 'pino-pretty',
});

const queriesFileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `./logs/queries.log` },
});

const monitoringFileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `./logs/queries.log` },
});

const logStream = [fileTransport, consoleTransport];

export const logger = pino(logConfig, pino.multistream(logStream));
export const queriesLogger = pino(logConfig, queriesFileTransport);
export const monitoringLogger = pino(logConfig, monitoringFileTransport);
