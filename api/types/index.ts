import { JwtPayload } from 'jsonwebtoken';
import { UserRoleEnum } from '../core/features/user/model';
import { Context } from 'koa';

export type SyContext = Context & {
  session: (Context['session'] & ContextState) | null;
};

// const { user, role, token }: ContextState = ctx.state;
export type ContextState = {
  user: string;
  role: string;
  token2: JwtPayload;
  views?: number;
  pagesViewed?: string[];
};

export type UserSession = {
  id: number;
  username: string;
  role?: UserRoleEnum;
  theme?: string;
};

export type CacheDTO = {
  cacheKey: string;
  response: string;
};
