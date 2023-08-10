export interface UserPayload {
  id: number;
  username: string;
  role?: string;
}

export interface RefreshPayload {
  username: string;
}
