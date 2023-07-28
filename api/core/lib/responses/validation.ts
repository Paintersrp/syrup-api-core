export const ValidationResponses = {
  ARRAY_FAIL: (param: any) => `Expected array, but got ${typeof param}`,
  OBJECT_FAIL: (param: any) => `Expected object, but got ${typeof param}`,
  RANGE_FAIL: (min: number, max: number, param: number) =>
    `Expected a number between ${min} and ${max}, but got ${param}`,
  KEY_FAIL: (key: string) => `Expected key "${String(key)}", but it does not exist`,
  LENGTH_FAIL: (min: number, max: number, paramLength: number) =>
    `Expected length between ${min} and ${max}, but got ${paramLength}`,
  LENGTH_TYPE_FAIL: (param: any) => `Cannot determine the length of ${typeof param}`,
  REGEX_FAIL: (str: string, regexString: string) =>
    `The string ${str} does not match the expected pattern: ${regexString}`,
  ALPHANUMERIC_FAIL: (param: string) => `Expected alphanumeric string, but got "${param}" instead.`,
  ID_FAIL: 'Invalid ID',
  IDS_FAIL: 'Invalid IDs',
  ITEM_FAIL: 'No item found.',
  ITEMS_FAIL: 'No items found.',
  NO_ID: 'No ID Param Found',
  NO_PAYLOAD: 'No Payload Found',
  PAYLOAD_FAIL: 'Invalid Payload (fields)',
  QUERY_MISSING: (param: string) => `Missing query parameter: ${param}`,
  QUERY_INVALID: (param: string) => `Invalid query parameter: ${param}`,
  PARAM_FAIL: (param: string) => `Missing request parameter: ${param}`,
  HEADER_FAIL: (headerName: string) => `Missing request headers: ${headerName}`,
  TYPE_FAIL: (type: string, param: unknown) => `Expected ${type}, but got ${typeof param}`,
};
