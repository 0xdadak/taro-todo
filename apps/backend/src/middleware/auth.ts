import { Elysia, t } from 'elysia';
import { verifyToken } from '../utils/jwt';
import { ERROR_CODES } from '@taro-todo/shared';

export interface AuthUser {
  userId: string;
  openId: string;
}

export const authMiddleware = new Elysia({ name: 'auth' })
  .derive(({ headers, set }) => {
    const getCurrentUser = (): AuthUser => {
      const authHeader = headers['authorization'];
      if (!authHeader) {
        set.status = 401;
        throw new Error(ERROR_CODES.UNAUTHORIZED);
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      const payload = verifyToken(token);
      if (!payload) {
        set.status = 401;
        throw new Error(ERROR_CODES.UNAUTHORIZED);
      }

      return payload;
    };

    const tryGetCurrentUser = (): AuthUser | null => {
      const authHeader = headers['authorization'];
      if (!authHeader) {
        return null;
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      return verifyToken(token);
    };

    return { getCurrentUser, tryGetCurrentUser };
  })
  .onError(({ code, error, set }) => {
    const errorMessage = 'message' in error ? error.message : String(error);
    if (errorMessage === ERROR_CODES.UNAUTHORIZED) {
      set.status = 401;
      return {
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Unauthorized',
        },
      };
    }
  });
