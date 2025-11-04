import jwt from '@tsndr/cloudflare-worker-jwt';

interface JwtPayload {
  id: number;
  email: string;
}

export class JwtUtils {
  private static readonly secret = process.env.JWT_SECRET || 'default_secret';

  static generateToken(payload: JwtPayload): Promise<string> {
    return jwt.sign(payload, this.secret);
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret)
      if(!decoded) return null
      const payload = jwt.decode(token)
      return payload.payload as JwtPayload;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
}