import { Context, Next } from 'koa';
import crypto, { BinaryToTextEncoding } from 'crypto';

/**
 * ETag is a decorator that sets the 'ETag' header of the response context based on the hash of the response body.
 * It improves caching and optimizes client-server communication.
 *
 * @param {string} algorithm - The algorithm used for hash generation. Defaults to 'sha256'.
 * @param {BinaryToTextEncoding} encoding - The hash digest encoding. Defaults to 'base64'.
 *
 * @example
 * @ETag('sha256', 'base64')
 * async someFunction(ctx: Context, next: Next) {}
 */
export function ETag(algorithm: string = 'sha256', encoding: BinaryToTextEncoding = 'base64') {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context, next: Next) {
      try {
        // Execute the original method
        await originalMethod.call(this, ctx, next);

        // If there's a body, generate and set the ETag
        if (ctx.body) {
          const hash = crypto.createHash(algorithm);
          hash.update(JSON.stringify(ctx.body));
          ctx.set('ETag', hash.digest(encoding));
        }

        return ctx.body;
      } catch (error) {
        // Log or handle error appropriately
        console.error(`Error in ETag decorator: ${error}`);
        throw error;
      }
    };

    return descriptor;
  };
}
