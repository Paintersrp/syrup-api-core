import { Role } from '../Role';
import { Context } from 'koa';

describe('Role', () => {
  it('should throw a TypeError if roles is not an array', () => {
    expect(() => Role(null as any)).toThrow(TypeError);
    expect(() => Role('admin' as any)).toThrow(TypeError);
    expect(() => Role(undefined as any)).toThrow(TypeError);
  });

  it('should call the original method if the user has a valid role', async () => {
    class TestClass {
      @Role(['admin', 'moderator'])
      async someFunction(ctx: Context, next: () => Promise<any>) {
        return true;
      }
    }

    const ctx: Partial<Context> = {
      state: { user: { role: 'admin' } },
    };
    const next = jest.fn();

    const testInstance = new TestClass();
    await expect(testInstance.someFunction(ctx as Context, next)).resolves.toBe(true);
  });

  it('should throw an error if the user does not have a valid role', async () => {
    class TestClass {
      @Role(['admin', 'moderator'])
      async someFunction(ctx: Context, next: () => Promise<any>) {
        return true;
      }
    }

    const ctx: Partial<Context> = {
      state: { user: { role: 'guest' } },
    };
    const next = jest.fn();

    const testInstance = new TestClass();
    await expect(testInstance.someFunction(ctx as Context, next)).rejects.toThrow('Forbidden');
  });

  it('should throw an error if the user is not defined', async () => {
    class TestClass {
      @Role(['admin', 'moderator'])
      async someFunction(ctx: Context, next: () => Promise<any>) {
        return true;
      }
    }

    const ctx: Partial<Context> = { state: {} };
    const next = jest.fn();

    const testInstance = new TestClass();
    await expect(testInstance.someFunction(ctx as Context, next)).rejects.toThrow('Forbidden');
  });
});
