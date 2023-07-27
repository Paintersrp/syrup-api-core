export const UserResponses = {
  CREATED: (name: string) => `User ${name} created successfully`,
  UPDATED: (name: string) => `User ${name} updated successfully`,
  DELETED: (name: string) => `User ${name} deleted successfully`,
  NOT_FOUND: (name: string) => `User ${name} not found`,
  ALREADY_EXISTS: (name: string) => `User ${name} already exists`,
  INVALID_CREDENTIALS: 'Invalid username or password',
  LOGIN_SUCCESS: (name: string) => `User ${name} logged in successfully`,
  LOGOUT_SUCCESS: (name: string) => `User ${name} logged out successfully`,
  AUTH_EXPIRED: 'Authorization token has expired',
  INVALID_TOKEN: 'Invalid token',
};
