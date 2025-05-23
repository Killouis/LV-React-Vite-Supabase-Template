import { Role } from './Role';
import { User } from './User';

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => Promise<User | null>;
  logout: () => Promise<void>;
  hasRole: (role: Role) => boolean;
};
