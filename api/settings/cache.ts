import { SyLFUCache } from '../core/cache/clients/lfu/SyLFUCache';
import { ORM } from './internal';

import { APP_LOGGER } from './internal/logger';

export const CACHE = {
  TYPE: 'in-memory',
  OPTIONS: {
    defaultTTL: 60,
    maxCacheSize: 5000,
    evictInterval: 30000,
  },
  ALERTS: {
    minHitRatio: 0.8,
    maxEvictions: 100,
  },
};

// Make dynamic based on type selected, move to internal
export const cache = new SyLFUCache(ORM.database, APP_LOGGER);
// export const cache = new SyLRUCache(ORM.database, logger);
