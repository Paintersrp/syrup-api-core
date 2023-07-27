export const ServerResponses = {
  INTERNAL_ERROR: 'Internal server error',
  CONNECTION_ERROR: 'Could not connect to server',
  TIMEOUT: 'Server response timed out',
  MAINTENANCE: 'Server is under maintenance',
  OVERLOADED: 'Server is overloaded',
  STARTED: (port: number) => `Server started on port ${port}`,
  STOPPED: 'Server stopped',
};
