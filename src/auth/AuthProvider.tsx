import { supabase } from '@/lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContextType } from './models/AuthContextType';
import { Role } from './models/Role';
import { User } from './models/User';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => null,
  logout: async () => {},
  hasRole: () => false,
  signUp: async () => null,
  signInWithGoogle: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error.message);
        }
        if (session?.user) {
          setUser(mapSupabaseUserToLocalUser(session.user));
        }
      } catch (e: any) {
        console.error('Exception in fetchSession:', e.message);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            if (session?.user) {
              setUser(mapSupabaseUserToLocalUser(session.user));
            } else {
              setUser(null);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        } catch (e: any) {
          console.error('Exception in onAuthStateChange handler:', e.message);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    if (!password) {
      console.warn('Password is required for email login.');
      return null;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Login error:', error.message);
        return null;
      }
      if (data?.user) {
        const mappedUser = mapSupabaseUserToLocalUser(data.user);
        return mappedUser;
      }
      return null;
    } catch (e: any) {
      console.error('Exception during login:', e.message);
      return null;
    }
  }, []);

  const signUp = useCallback(async (email: string, password?: string) => {
    if (!password) {
      console.warn('Password is required for email sign up.');
      return null;
    }
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Sign up error:', error.message);
        return null;
      }
      if (data?.user) {
        if (data.session?.user) {
          return mapSupabaseUserToLocalUser(data.session.user);
        }
        return mapSupabaseUserToLocalUser(data.user);
      }
      return null;
    } catch (e: any) {
      console.error('Exception during sign up:', e.message);
      return null;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        console.error('Google sign in error:', error.message);
      }
    } catch (e: any) {
      console.error('Exception during Google sign in:', e.message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      }
    } catch (e: any) {
      console.error('Exception during logout:', e.message);
    }
  }, []);

  const hasRole = useCallback(
    (role: Role) => {
      if (!user) return false;
      return user.roles.includes(role);
    },
    [user]
  );

  if (loadingInitial) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        hasRole,
        signUp,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const mapSupabaseUserToLocalUser = (supabaseUser: SupabaseUser): User => {
  let name = supabaseUser.email?.split('@')[0] || 'User';
  if (supabaseUser.user_metadata?.full_name) {
    name = supabaseUser.user_metadata.full_name;
  } else if (supabaseUser.user_metadata?.name) {
    name = supabaseUser.user_metadata.name;
  }
  let roles = [Role.USER];
  if (
    supabaseUser.app_metadata?.roles &&
    Array.isArray(supabaseUser.app_metadata.roles)
  ) {
    roles = supabaseUser.app_metadata.roles.filter((r: any) =>
      Object.values(Role).includes(r)
    );
    if (roles.length === 0) roles = [Role.USER];
  }

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name,
    roles,
    createdAt: new Date(supabaseUser.created_at || Date.now()),
    updatedAt: new Date(
      supabaseUser.updated_at || supabaseUser.created_at || Date.now()
    ),
  };
};
