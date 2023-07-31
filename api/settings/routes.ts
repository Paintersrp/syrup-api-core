import * as Routes from '../routes';
import { RouteConstructor } from '../types';

export const ROUTES: RouteConstructor[] = [
  Routes.UserRoutes,
  Routes.ProfileRoutes,
  Routes.BlacklistRoutes,
  Routes.CacheRoutes,
];
