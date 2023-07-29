export const ValidationResponses = {
  // ID validation responses
  ID_FAIL: 'Invalid ID',
  IDS_FAIL: 'Invalid IDs',

  // Item validation responses
  ITEM_FAIL: 'No item found.',
  ITEMS_FAIL: 'No items found.',
  NO_ID: 'No ID Param Found',

  // Payload validation responses
  NO_PAYLOAD: 'No Payload Found.',
  PAYLOAD_FAIL: 'Invalid Payload (fields)',

  // Type validation responses
  ARRAY_FAIL: (param: any) => `Expected array, but got ${typeof param}`,
  OBJECT_FAIL: (param: any) => `Expected object, but got ${typeof param}`,
  TYPE_FAIL: (type: string, param: unknown) => `Expected ${type}, but got ${typeof param}`,

  // Range validation responses
  RANGE_FAIL: (min: number, max: number, param: number) =>
    `Expected a number between ${min} and ${max}, but got ${param}`,

  // Key validation responses
  KEY_FAIL: (key: string) => `Expected key "${String(key)}", but it does not exist`,

  // Length validation responses
  LENGTH_FAIL: (min: number, max: number, paramLength: number) =>
    `Expected length between ${min} and ${max}, but got ${paramLength}`,
  LENGTH_TYPE_FAIL: (param: any) => `Cannot determine the length of ${typeof param}`,

  // Regular expression validation responses
  REGEX_FAIL: (str: string, regexString: string) =>
    `The string ${str} does not match the expected pattern: ${regexString}`,

  // Alphanumeric validation responses
  ALPHANUMERIC_FAIL: (param: string) => `Expected alphanumeric string, but got "${param}" instead.`,

  // Query validation responses
  QUERY_MISSING: (param: string) => `Missing query parameter: ${param}`,
  QUERY_INVALID: (param: string) => `Invalid query parameter: ${param}`,

  // Request validation responses
  PARAM_FAIL: (param: string | any) => `Missing request parameter: ${param}`,
  HEADER_FAIL: (headerName: string) => `Missing request headers: ${headerName}`,

  // Existence validation responses
  EXIST_FAIL: <T>(param: T | null | undefined) => `Parameter ${param} does not exist.`,

  // Format validation responses
  DATE_FAIL: (str: string) => `Invalid date: ${str}`,
  EMAIL_FAIL: (str: string) => `Invalid email: ${str}`,
  URL_FAIL: (str: string) => `Invalid URL: ${str}`,
  UUID_FAIL: (str: string) => `Invalid UUID: ${str}`,
};
