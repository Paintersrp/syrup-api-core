export const ValidationResponses = {
  ARRAY_FAIL: 'Request body must be an array',
  ID_FAIL: 'Invalid ID',
  IDS_FAIL: 'Invalid IDs',
  ITEM_FAIL: 'No item found.',
  ITEMS_FAIL: 'No items found.',
  NO_ID: 'No ID Param Found',
  NO_PAYLOAD: 'No Payload Found',
  PAYLOAD_FAIL: 'Invalid Payload (fields)',
  QUERY_MISSING: (param: string) => `Missing query parameter: ${param}`,
  QUERY_INVALID: (param: string) => `Invalid query parameter: ${param}`,
};
