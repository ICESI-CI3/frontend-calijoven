'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/me');

      if (!response.ok) {
        setUser(null);
      } else {
        const userData: User = await response.json();

        if (userData.roles && Array.isArray(userData.roles)) {
          userData.roles = userData.roles.map((role) => {
            if (typeof role === 'string') {
              return {
                id: role,
                name: role,
                description: role,
                permissions: [],
              };
            }
            return role;
          });
        }

        setUser(userData);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
      setError('Failed to load user data.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User, token: string) => {
    if (userData.roles && Array.isArray(userData.roles)) {
      userData.roles = userData.roles.map((role) => {
        if (typeof role === 'string') {
          return {
            id: role,
            name: role,
            description: role,
            permissions: [],
          };
        }
        return role;
      });
    }

    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Failed to logout:', err);
    }

    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const contextValue: UserContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    fetchUser,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
