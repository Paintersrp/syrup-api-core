import { JwtPayload } from 'jsonwebtoken';
import { UserRoleEnum } from '../models/user';
import { BlacklistRoutes, CacheRoutes, ProfileRoutes, UserRoutes } from '../routes';

// const { user, role, token }: ContextState = ctx.state;
export type ContextState = {
  user: string;
  role: string;
  token2: JwtPayload;
};

export type UserSession = {
  id: number;
  username: string;
  role?: UserRoleEnum;
  theme?: string;
};

export type RouteConstructor =
  | typeof UserRoutes
  | typeof ProfileRoutes
  | typeof BlacklistRoutes
  | typeof CacheRoutes
  | any;

export type CacheDTO = {
  cacheKey: string;
  response: string;
};
