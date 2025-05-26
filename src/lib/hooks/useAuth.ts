import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { extractTokenPayload } from '../../modules/auth/utils/tokenService';
import { setAuthCookie, removeAuthCookie } from '../../modules/auth/utils/cookieService';

/**
 * Estado de autenticación
 * @interface AuthState
 * @property {User | null} user - Usuario actual o null si no hay sesión
 * @property {boolean} isAuthenticated - Indica si hay un usuario autenticado
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

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
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          // Eliminar cookie
          await removeAuthCookie();

          // Limpiar estado
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      },

      updateUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),
    }),
    {
      name: 'auth-user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
