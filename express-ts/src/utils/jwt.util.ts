import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
}

export class JwtUtils {
  private static readonly secret = process.env.JWT_SECRET || 'default_secret';
  private static readonly expiresIn = '1h';

  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
}