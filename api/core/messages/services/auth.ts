import { BaseMessages, BaseMessagesInteface } from '../base';

type AuthActions = 'login' | 'logout' | 'verification' | 'registration';

interface AuthMessagesInterface extends BaseMessagesInteface<AuthActions> {
  ALREADY_LOGGED_IN: string;
  TOKEN_ERROR: string;
  TOKEN_EXPIRED: string;
  INVALID_PASSWORD: string;
  PERMISSION_DENIED: (role: string) => string;
  USER_NOT_FOUND: (username: string) => string;
}

export const AuthMessages: AuthMessagesInterface = {
  ...BaseMessages,
  ALREADY_LOGGED_IN: 'User already logged in',
  TOKEN_ERROR: 'Error refreshing token',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_PASSWORD: 'Invalid password',
  PERMISSION_DENIED: (role) => `Permission denied for role ${role}`,
  USER_NOT_FOUND: (username) => `User not found. Recevied username: ${username}`,
};
