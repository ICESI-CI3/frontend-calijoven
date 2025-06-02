import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '@/types/user';
import {
  extractTokenPayload,
  validateToken,
} from '../../modules/auth/utils/tokenService';
import { useEffect } from 'react';

/**
 * Estado de autenticación
 * @interface AuthState
 * @property {User | null} user - Usuario actual o null si no hay sesión
 * @property {boolean} isAuthenticated - Indica si hay un usuario autenticado
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setHydrated: (state: boolean) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  getStoredToken: () => string | null;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isHydrated: false,

      login: (user: User, token: string) => {
        try {
          const payload = extractTokenPayload(token);

          if (!payload) {
            throw new Error('Invalid token format');
          }

          // Add roles from token payload to user
          user.roles = payload.authorities || [];

          // Update Zustand state
          set({
            user,
            token,
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      logout: () => {
        try {

          // Clear Zustand state
          set({
            user: null,
            token: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      },

      updateUser: (user: User) =>
        set({
          user,
        }),

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      clearAuth: () => {
        set({
          user: null,
          token: null,
        });
      },

      isAuthenticated: () => {
        const state = get();

        // Check if we have a user and a valid token
        return !!(state.user && validateToken(state.token || undefined));
      },

      getStoredToken: () => {
        return get().token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);

          if (state.token && !validateToken(state.token)) {
            state.clearAuth();
          }
        }
      },
    }
  )
);

export function useHydration() {
  const isHydrated = useAuth((state) => state.isHydrated);
  const setHydrated = useAuth((state) => state.setHydrated);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return isHydrated;
}

/**
 * Hook to periodically check the validity of the token
 * Only runs when there is an authenticated user
 */
export function useTokenValidator() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const clearAuth = useAuth((state) => state.clearAuth);
  const isHydrated = useAuth((state) => state.isHydrated);
  const getStoredToken = useAuth((state) => state.getStoredToken);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const checkTokenValidity = () => {
      const token = getStoredToken();
      if (token && !validateToken(token)) {
        clearAuth();
      }
    };

    // Check immediately
    checkTokenValidity();

    // Check every 5 minutes
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    // Check when window gains focus
    const handleFocus = () => {
      checkTokenValidity();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, clearAuth, isHydrated, getStoredToken]);
}

/**
 * Hook to synchronize the authentication state between tabs
 * Detects when the localStorage is cleared in another tab
 */
export function useAuthSync() {
  const user = useAuth((state) => state.user);
  const clearAuth = useAuth((state) => state.clearAuth);
  const updateUser = useAuth((state) => state.updateUser);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Handle auth storage changes
      if (e.key === 'auth-storage') {
        if (e.newValue === null && user) {
          // Auth storage was cleared, clear our state
          clearAuth();
        } else if (e.newValue && !user) {
          // Auth storage was added, try to restore
          try {
            const authData = JSON.parse(e.newValue);
            if (authData.state?.user) {
              updateUser(authData.state.user);
            }
          } catch (error) {
            console.error('Error parsing auth storage:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, clearAuth, updateUser]);
}
