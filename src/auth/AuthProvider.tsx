import { createContext, useCallback, useContext, useState } from 'react';
import { AuthContextType } from './models/AuthContextType';
import { Role } from './models/Role';
import { User } from './models/User';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {
    return null;
  },
  logout: async () => {},
  hasRole: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string) => {
    // TODO: Replace with actual authentication logic
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      roles: [Role.ADMIN, Role.USER],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: Role) => {
      if (!user) return false;
      return user.roles.includes(role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
