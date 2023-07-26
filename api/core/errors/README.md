# API Error Documentation

This documentation covers all the error types and their respective internal codes that the system can potentially return. It's designed to help you better understand the potential errors you might encounter when interacting with our API.

#

## Definition of SyError Class

The `SyError` class constructor accepts various parameters such as:

- `status`: HTTP status code of the error.
- `category`: Error category, either CLIENT or SERVER, automatically determined.
- `errorCode`: Specific error code representing the type of error.
- `message`: A human-readable message providing more details about the error.
- `details`: Detailed information about the error.
- `internalErrorCode`: A localized error code to better trace the error.

All these parameters help in categorizing the error and providing more context about what exactly the error is. The timestamp is also attached to the error instance to provide timing information.

#

## Methods of SyError class

- `toResponse`: This method converts the error object into a standardized response format to be sent back to the client. If user and request information are available in the Koa context (`ctx`), these are also included in the response.
- `logError`: This method logs the error details for debugging and tracing. Like `toResponse`, it uses the Koa context to enrich the log data with user and request information.

- `toString`: This method returns a stringified version of the error which can be useful for logging or other outside usage. It includes most of the information about the error and the request that caused it.

- `createErrorType`: This static method returns a constructor function for a subclass of `SyError` with certain fixed parameters (status, category, and errorCode). This method is used to create specific error types like `BadRequestError`, `ConflictError`, etc.

#

## Categories

Errors are divided into two categories:

1. **Client Errors**: These errors typically indicate that the request contains bad syntax or cannot be fulfilled.
2. **Server Errors**: These errors indicate that the server failed to fulfill an apparently valid request.

#

## Client Errors

Client errors are usually due to incorrect data or invalid requests sent by the user.

#

### BadRequestError

**HTTP Status Code**: 400

**Internal Code**: `ErrorCodes.BAD_REQUEST`

This error indicates that the server could not understand the request due to invalid syntax. Check the request payload and parameters for any inconsistencies or missing data.

#

### ConflictError

**HTTP Status Code**: 409

**Internal Code**: `ErrorCodes.CONFLICT`

This error indicates that the request could not be completed due to a conflict with the current state of the target resource. This might be due to trying to create a resource that already exists or deleting a resource that doesn't exist.

#

### ExpectationFailedError

**HTTP Status Code**: 417

**Internal Code**: `ErrorCodes.EXPECTATION_FAILED`

This error is thrown when the server cannot meet the requirements of the Expect request-header field.

#

### ForbiddenError

**HTTP Status Code**: 403

**Internal Code**: `ErrorCodes.FORBIDDEN`

This error means the server understood the request, but it refuses to authorize it. This status is similar to 401 (Unauthorized), but indicates that the client must authenticate itself to get the requested response.

#

### GoneError

**HTTP Status Code**: 410

**Internal Code**: `ErrorCodes.GONE`

This error indicates that the requested resource is no longer available and will not be available again.

#

### NoContentError

**HTTP Status Code**: 204

**Internal Code**: `ErrorCodes.NO_CONTENT`

This error means that the server successfully processed the request and is not returning any content.

#

### NotFoundError

**HTTP Status Code**: 404

**Internal Code**: `ErrorCodes.NOT_FOUND`

This error means that the server can not find the requested resource. This can be a missing endpoint or a resource that doesn't exist.

#

### RequestTimeoutError

**HTTP Status Code**: 408

**Internal Code**: `ErrorCodes.REQUEST_TIMEOUT`

This error is thrown when the server would like to shut down a non-used connection. It is sent on an idle connection by some servers, even without any previous request by the client.

#

### TooManyRequestsError

**HTTP Status Code**: 429

**Internal Code**: `ErrorCodes.TOO_MANY_REQUESTS`

This error is thrown when the user has sent too many requests in a given amount of time.

#

### UnauthorizedError

**HTTP Status Code**: 401

**Internal Code**: `ErrorCodes.UNAUTHORIZED`

This error means that the request lacks valid authentication credentials for the target resource.

#

### UnsupportedMediaError

**HTTP Status Code**: 415

**Internal Code**: `ErrorCodes.UNSUPPORTED_MEDIA`

This error is thrown when the media format of the requested data is not supported by the server, so the server is rejecting the request.

#

## Server Errors

Server errors occur when a request is formed correctly, but the server fails to complete it. These errors are often not the fault of the requestor and should be handled internally.

#

### BadGatewayError

**HTTP Status Code**: 502

**Internal Code**: `ErrorCodes.BAD_GATEWAY`

This error means that the server was acting as a gateway or proxy and received an invalid response from the upstream server.

#

### GatewayTimeoutError

**HTTP Status Code**: 504

**Internal Code**: `ErrorCodes.GATEWAY_TIMEOUT`

This error means that the server, while acting as a gateway or proxy, did not receive a timely response from the upstream server it accessed in attempting to complete the request.

#

### InternalServerError

**HTTP Status Code**: 500

**Internal Code**: `ErrorCodes.INTERNAL_SERVER`

This is a generic error message, given when an unexpected condition was encountered and no more specific message is suitable.

#

### ServiceUnavailableError

**HTTP Status Code**: 503

**Internal Code**: `ErrorCodes.SERVICE_UNAVAILABLE`

This error occurs when the server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.

Please note that these errors include a `timestamp` field to provide the exact time the error was thrown and an `internalErrorCode` which can be used to trace the error in the server logs. Also, a `details` field may be included to provide more context about the error.

#

## Usage Examples

This section provides code examples of how to use and handle the error classes in your application. These are especially useful in creating custom error handling middleware for your Koa app.

#

### Using Error Classes

The error classes can be used in your route handlers to throw specific errors based on different conditions. Here is an example:

```javascript
import { NotFoundError } from './errors';

app.use(async (ctx, next) => {
  const user = await getUser(ctx.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  ctx.body = user;
});
```

In the above example, if the user does not exist in the database, a `NotFoundError` is thrown. The error message 'User not found' can be used to provide more detail about the error.

#

### Error Handling Middleware

Koa middleware can be created to handle these errors and send appropriate responses to the client. Here is an example of how you can do this:

```javascript
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof SyError) {
      ctx.status = err.status;
      ctx.body = err.toResponse();
    } else {
      ctx.status = 500;
      ctx.body = 'Unexpected error occurred';
    }
  }
});
```

In this middleware, if the error thrown is an instance of `SyError` (or one of its subclasses), it will be caught and an appropriate HTTP response will be sent based on the properties of the error. If the error is not a `SyError`, a generic 'Unexpected error occurred' message is sent with a 500 status code.

This middleware should be placed at the top of your middleware stack to ensure that it catches all errors thrown in subsequent middleware and route handlers.

#
