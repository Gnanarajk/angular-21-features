export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  role: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  role: string;
}
