export interface UserPayload {
  id: number;
  username: string;
  role?: string;
  exp?: string;
}

export interface RefreshPayload {
  username: string;
}
