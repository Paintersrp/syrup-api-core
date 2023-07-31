/**
 * @todo Implement into LoggerDefaults
 * @todo Generate Loggers based on this config?
 */
export const LOGGERS = {
  APP: {
    ENABLED: true,
    LOGLEVEL: 'trace',
    VERBOSE: true,
    LOG_FILE_DESTINATION: './logs/app.log',
  },
  QUERY: {
    ENABLED: true,
    LOGLEVEL: 'trace',
    VERBOSE: false,
    LOG_FILE_DESTINATION: './logs/queries.log',
  },
  ERROR: {
    ENABLED: true,
    LOGLEVEL: 'trace',
    VERBOSE: false,
    LOG_FILE_DESTINATION: './logs/errors.log',
  },
  AUDIT: {
    ENABLED: true,
    LOGLEVEL: 'trace',
    VERBOSE: true,
    LOG_FILE_DESTINATION: './logs/audits.log',
  },
  ACCESS: {
    ENABLED: true,
    LOGLEVEL: 'trace',
    VERBOSE: true,
    LOG_FILE_DESTINATION: './logs/access.log',
  },
  MAX_LOG_FILE_SIZE: 5,
};
