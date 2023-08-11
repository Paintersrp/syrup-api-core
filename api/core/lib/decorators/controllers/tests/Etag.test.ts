import crypto from 'crypto';
import { Context } from 'koa';
import { ETag } from '../Etag';

describe('ETag', () => {
  it('should set the ETag header based on the hash of the response body', async () => {
    // Mock response body
    const responseBody = { data: 'test' };

    // Mock Koa context
    const ctx: Partial<Context> = {
      body: responseBody,
      set: jest.fn(),
    };

    // Mock next function
    const next = jest.fn();

    // Function to be decorated
    async function someFunction(context: Context, _next: () => Promise<any>) {
      context.body = responseBody;
    }

    // Applying the ETag decorator
    const descriptor = {
      value: someFunction,
    };
    const decoratedDescriptor = ETag()(null, '', descriptor);

    // Executing the decorated function
    await decoratedDescriptor.value(ctx as Context, next);

    // Verifying the ETag header
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(responseBody));
    const expectedETag = hash.digest('base64');

    expect(ctx.set).toHaveBeenCalledWith('ETag', expectedETag);
  });

  it('should log an error and re-throw it if an exception occurs', async () => {
    // Mock Koa context
    const ctx: Partial<Context> = {};

    // Mock next function
    const next = jest.fn();

    // Function to be decorated that throws an error
    async function someFunction() {
      throw new Error('Test error');
    }

    // Applying the ETag decorator
    const descriptor = {
      value: someFunction,
    };
    const decoratedDescriptor = ETag()(null, '', descriptor);

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Expecting the decorated function to throw an error
    await expect(decoratedDescriptor.value(ctx as Context, next)).rejects.toThrow('Test error');

    // Verifying that console.error was called with the correct message
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in ETag decorator: Error: Test error');

    // Clean up the spy
    consoleErrorSpy.mockRestore();
  });
});
