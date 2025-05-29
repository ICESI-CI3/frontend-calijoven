import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { extractTokenPayload } from '../../modules/auth/utils/tokenService';
import { setAuthCookie, removeAuthCookie } from '../../modules/auth/utils/cookieService';
import { useEffect } from 'react';

/**
 * Estado de autenticación
 * @interface AuthState
 * @property {User | null} user - Usuario actual o null si no hay sesión
 * @property {boolean} isAuthenticated - Indica si hay un usuario autenticado
 */
interface AuthState {
  user: User | null;
  isHydrated: boolean;
  login: (user: User, token: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  setHydrated: (state: boolean) => void;
  clearUser: () => void;
  checkSession: () => Promise<boolean>;
  restoreUserFromSession: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isHydrated: false,

      login: async (user: User, token: string, rememberMe = false) => {
        try {
          const payload = extractTokenPayload(token);

          if (!payload) {
            throw new Error('Invalid token format');
          }

          user.roles = payload.authorities || [];

          await setAuthCookie(token, { rememberMe });

          set({
            user,
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await removeAuthCookie();
          set({
            user: null,
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

      clearUser: () => set({ user: null }),

      checkSession: async () => {
        try {
          const response = await fetch('/api/auth/session', {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            const currentUser = get().user;
            if (currentUser) {
              set({ user: null });
            }
            return false;
          }

          const data = await response.json();
          return data.valid === true;
        } catch (error) {
          console.error('Error checking session:', error);
          const currentUser = get().user;
          if (currentUser) {
            set({ user: null });
          }
          return false;
        }
      },

      restoreUserFromSession: async () => {
        try {
          const response = await fetch('/api/auth/session', {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.valid && data.user) {
              set({ user: data.user });
            }
          }
        } catch (error) {
          console.error('Error restoring user from session:', error);
        }
      },
    }),
    {
      name: 'auth-user-storage',
      partialize: (state) => ({ user: state.user }),
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
          if (!state.user) {
            state.restoreUserFromSession();
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
 * Hook to periodically check the validity of the session
 * Only runs when there is an authenticated user
 */
export function useSessionValidator() {
  const user = useAuth((state) => state.user);
  const checkSession = useAuth((state) => state.checkSession);
  const isHydrated = useAuth((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated || !user) {
      return;
    }

    checkSession();

    const interval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000);

    const handleFocus = () => {
      checkSession();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, checkSession, isHydrated]);
}

/**
 * Hook to synchronize the authentication state between tabs
 * Detects when the localStorage is cleared in another tab
 */
export function useAuthSync() {
  const user = useAuth((state) => state.user);
  const clearUser = useAuth((state) => state.clearUser);
  const updateUser = useAuth((state) => state.updateUser);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-user-storage') {
        if (e.newValue === null && user) {
          // Se eliminó el storage y tenemos un usuario, limpiarlo
          clearUser();
        } else if (e.newValue && !user) {
          // Se agregó un usuario al storage y no tenemos usuario, restaurarlo
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
  }, [user, clearUser, updateUser]);
}

/**
 * Hook para manejar la restauración automática del usuario
 * Se ejecuta una sola vez después de la hidratación
 */
export function useUserRestoration() {
  const user = useAuth((state) => state.user);
  const isHydrated = useAuth((state) => state.isHydrated);
  const restoreUserFromSession = useAuth((state) => state.restoreUserFromSession);

  useEffect(() => {
    if (isHydrated && !user) {
      restoreUserFromSession();
    }
  }, [isHydrated, user, restoreUserFromSession]);
}
