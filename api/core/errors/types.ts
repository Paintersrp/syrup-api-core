import { IncomingHttpHeaders } from 'http';
import { ErrorCodes } from './enums';

/**
 * Interface for the standard structure of error responses returned by the API.
 *
 * @interface ErrorResponse
 * @property {number} status - The HTTP status code of the error.
 * @property {string} message - A detailed, developer-friendly message providing more information about the error.
 * @property {string} [userMessage] - An optional user-friendly error message that can be directly shown to the end-user.
 * @property {any} [details] - Additional information about the error, useful for debugging. This can be an object or array.
 * @property {ErrorCodes} [code] - An optional error code representing the type of the error. These codes are defined in the ErrorCodes enum.
 * @property {string} [internalErrorCode] - An optional localized error code for better traceability within the system.
 * @property {string} timestamp - The date and time when the error was instantiated, in ISO string format.
 * @property {string} [stack] - The optional stack trace of the error, useful for debugging.
 * @property {any} [user] - Optional details of the user that encountered the error.
 * @property {number} [requestId] - Optional unique identifier for the request that caused the error.
 * @property {object} [request] - Optional details of the HTTP request that caused the error.
 * @property {string} request.method - HTTP method of the request.
 * @property {string} request.url - The URL that the request was made to.
 * @property {IncomingHttpHeaders} request.headers - HTTP headers of the request.
 * @property {unknown} request.body - The body of the request.
 */
export interface ErrorResponse {
  status: number;
  message: string;
  userMessage?: string;
  details?: any;
  code?: ErrorCodes;
  internalErrorCode?: string;
  timestamp: string;
  stack?: string;
  user?: any;
  requestId?: number;
  request?: {
    method: string;
    url: string;
    headers: IncomingHttpHeaders;
    body: unknown;
  };
}
