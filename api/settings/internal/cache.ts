import { SyLFUCache } from '../../core/cache/clients/lfu/SyLFUCache';
import { ORM } from '.';

import { APP_LOGGER } from './logger';

export const APP_CACHE = new SyLFUCache(ORM.database, APP_LOGGER);
// export const cache = new SyLRUCache(ORM.database, logger);
