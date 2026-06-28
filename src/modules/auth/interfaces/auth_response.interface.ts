import { AuthUser } from './auth_user.interface';

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}
