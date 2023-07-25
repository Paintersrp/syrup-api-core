import Router from 'koa-router';

export type StackedRouter = Router & { routerStack: any };
