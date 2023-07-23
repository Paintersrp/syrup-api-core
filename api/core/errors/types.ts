/**
 * ErrorResponse interface.
 *
 * @interface
 * @property {number} status - The HTTP status code of the error.
 * @property {string} message - A human-readable message providing more details about the error.
 * @property {string} [userMessage] - An optional user-friendly error message that can be directly shown to the end-user.
 * @property {any} [details] - Additional information about the error. Can be an object or array.
 * @property {string} [errorCode] - An error code representing the type of the error. These codes are defined in the ErrorCodes enum.
 * @property {string} [internalErrorCode] - A localized error code for better traceability within the system.
 * @property {string} timestamp - The date and time when the error was instantiated in an ISO string format.
 */
export interface ErrorResponse {
  status: number;
  message: string;
  userMessage?: string;
  details?: any;
  errorCode?: string;
  internalErrorCode?: string;
  timestamp: string;
}
