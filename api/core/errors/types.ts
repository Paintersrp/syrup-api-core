export interface ErrorResponse {
  status: number;
  message: string;
  userMessage?: string;
  details?: any;
  errorCode?: string;
  internalErrorCode?: string;
  timestamp: string;
}
