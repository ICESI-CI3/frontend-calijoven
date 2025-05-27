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
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
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
        if (state) state.setHydrated(true);
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
