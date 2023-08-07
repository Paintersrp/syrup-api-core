import { BaseMessages, BaseMessagesInteface } from '../base';

type CacheActions = 'hit' | 'miss' | 'update' | 'delete' | 'evict' | 'clear';

interface CacheMessagesInterface extends BaseMessagesInteface<CacheActions> {}

export const CacheMessages: CacheMessagesInterface = {
  ...BaseMessages,
};
