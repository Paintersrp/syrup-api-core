/**
 * Enum for response messages.
 *
 * @enum {string}
 */
export enum Responses {
  ARRAY_FAIL = 'Request body must be an array',
  DEL_OK = 'Item deleted successfully',
  DELS_OK = 'Items deleted successfully',
  ID_FAIL = 'Invalid ID',
  IDS_FAIL = 'Invalid IDs',
  INTERNAL_SERVER = 'Internal Server Error',
  ITEM_FAIL = 'Item not found',
  ITEMS_FAIL = 'No matching items found',
  NO_ID = 'No ID Param Found',
  NO_PAYLOAD = 'No Payload Found',
  PAYLOAD_FAIL = 'Invalid Payload (fields)',
  SOFT_DEL_FAIL = 'Unable to soft delete the item',
  SOFT_DEL_OK = 'Item soft deleted successfully',
  SOFT_DELS_OK = `Items soft deleted successfully`,
}
