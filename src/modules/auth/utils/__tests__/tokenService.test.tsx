import * as tokenService from '../tokenService';
import { PERMISSIONS, Permission } from '@/lib/constants/permissions';

describe('tokenService', () => {
  const validPayload = {
    sub: '1',
    email: 'test@example.com',
    id: '1',
    authorities: [PERMISSIONS.MANAGE_USER as Permission],
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  };

  function createToken(payload: object) {
    const base64 = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64');
    return `header.${base64(payload)}.signature`;
  }

  it('extrae el payload correctamente', () => {
    const token = createToken(validPayload);
    const payload = tokenService.extractTokenPayload(token);
    expect(payload).toMatchObject(validPayload);
  });

  it('devuelve null si el token es inválido', () => {
    expect(tokenService.extractTokenPayload('invalid.token')).toBeNull();
    expect(tokenService.extractTokenPayload(undefined)).toBeNull();
  });

  it('detecta expiración correctamente', () => {
    const expiredPayload = { ...validPayload, exp: Math.floor(Date.now() / 1000) - 10 };
    expect(tokenService.isTokenExpired(expiredPayload)).toBe(true);
    expect(tokenService.isTokenExpired(validPayload)).toBe(false);
  });

  it('valida token correctamente', () => {
    const token = createToken(validPayload);
    expect(tokenService.validateToken(token)).toBe(true);
    expect(tokenService.validateToken(undefined)).toBe(false);
    expect(tokenService.validateToken('invalid.token')).toBe(false);
  });

  it('calcula segundos hasta expiración', () => {
    const token = createToken(validPayload);
    const seconds = tokenService.getTokenExpirySeconds(token);
    expect(seconds).toBeGreaterThan(0);
    expect(seconds).toBeLessThanOrEqual(3600);
  });

  it('detecta identificador de usuario', () => {
    expect(tokenService.hasUserIdentifier(validPayload)).toBe(true);
    expect(tokenService.hasUserIdentifier(null)).toBe(false);
    expect(tokenService.hasUserIdentifier({})).toBe(false);
  });
}); 