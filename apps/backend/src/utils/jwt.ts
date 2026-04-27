import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN_SECONDS } from '@taro-todo/shared';

export interface JwtPayload {
  userId: string;
  openId: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_in_production';

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN_SECONDS,
      algorithm: 'HS256',
    }
  );
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as jwt.JwtPayload;
    return {
      userId: decoded.userId,
      openId: decoded.openId,
    };
  } catch {
    return null;
  }
}
