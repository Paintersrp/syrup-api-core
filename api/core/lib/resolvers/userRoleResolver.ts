import { IRouterContext } from 'koa-router';
import { UserRoleEnum } from '../../../models/user';

type UserRoleResolver = (ctx: IRouterContext) => Promise<UserRoleEnum>;

export const userRoleResolver: UserRoleResolver = async (ctx) => {
  return ctx.state.user ? ctx.state.user.role : UserRoleEnum.USER;
};
