import Koa from 'koa';

/**
 * Koa middleware to handle a 404 Not Found Response. Catches any 404 and returns a structured
 * default response error message.
 *
 * @param ctx - Koa context object.
 * @param next - Next middleware function.
 */
export const notFoundMiddleware: Koa.Middleware = async (ctx, next) => {
  try {
    await next();

    // if (ctx.response.status === 404 || !ctx.response.body) {
    //   const errorResponse = {
    //     error: {
    //       message: `The requested resource '${ctx.path}' was not found.`,
    //       description: `No view function could be found for the URL '${ctx.path}'.`,
    //       instructions:
    //         'This error may have occurred due to a temporary outage or maintenance. Please check back later or contact our support team if the issue persists.',
    //       thanks: 'Thank you for using Syrup!',
    //     },
    //   };

    //   ctx.status = 404;
    //   ctx.body = errorResponse;
    // }
  } catch (error) {
    throw error; // Pass the error to the error handler middleware
  }
};
