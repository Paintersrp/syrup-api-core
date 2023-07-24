import { SyLFUCache } from '../core/cache/SyLFUCache';
import { SyLRUCache } from '../core/cache/SyLRUCache';
import { ORM } from './db';
import { logger } from './loggers';

export const cache = new SyLFUCache(ORM.database, logger);
// export const cache = new SyLRUCache(ORM.database, logger);
