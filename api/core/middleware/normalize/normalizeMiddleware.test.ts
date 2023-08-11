import Koa from 'koa';
import { normalizeMiddleware, removeTrailingSlash } from './normalizeMiddleware';

describe('normalizeMiddleware', () => {
  let ctx: Koa.Context;
  let next: jest.Mock;

  beforeEach(() => {
    ctx = {
      path: '/',
      redirect: jest.fn(),
    } as any;
    next = jest.fn();
  });

  describe('when the path has a trailing slash and is not the root', () => {
    beforeEach(() => {
      ctx.path = '/some/path/';
    });

    it('should redirect to the path without the trailing slash', async () => {
      const normalizedPath = removeTrailingSlash(ctx.path);

      await normalizeMiddleware(ctx, next);

      expect(ctx.redirect).toHaveBeenCalledWith(normalizedPath);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('when the path does not have a trailing slash or is the root', () => {
    it('should call the next middleware if the path is the root', async () => {
      await normalizeMiddleware(ctx, next);

      expect(ctx.redirect).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should call the next middleware if the path does not have a trailing slash', async () => {
      ctx.path = '/some/path';

      await normalizeMiddleware(ctx, next);

      expect(ctx.redirect).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
