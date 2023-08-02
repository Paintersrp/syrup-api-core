export const UptimeResponses = {
  INVALID_TIMESTAMP: (now: unknown) =>
    `Invalid timestamp. Please provide a valid timestamp. Recevied: ${now}`,
  NO_RECORD: (name: unknown) => `No uptime record for ${name}`,
};
