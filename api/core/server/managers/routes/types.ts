import { BlacklistRoutes, CacheRoutes, ProfileRoutes, UserRoutes } from '../../../routes/internal';

export type RouteConstructor =
  | typeof UserRoutes
  | typeof ProfileRoutes
  | typeof BlacklistRoutes
  | typeof CacheRoutes
  | any;
