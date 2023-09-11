import { BlacklistRoutes } from '../../../features/blacklist';
import { CacheRoutes } from '../../../features/cache';
import { ProfileRoutes } from '../../../features/profile';
import { UserRoutes } from '../../../features/user';

export type RouteConstructor =
  | typeof UserRoutes
  | typeof ProfileRoutes
  | typeof BlacklistRoutes
  | typeof CacheRoutes
  | any;
