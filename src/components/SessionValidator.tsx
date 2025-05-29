'use client';

import { useSessionValidator, useAuthSync, useUserRestoration } from '@/lib/hooks/useAuth';

/**
 * Component that automatically checks the validity of the session
 * and synchronizes the state between tabs
 * Must be included in the main layout of the application
 */
export function SessionValidator() {
  useSessionValidator();
  useAuthSync();
  useUserRestoration();
  return null;
}
