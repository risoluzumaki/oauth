import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "../utils/jwt.util";

export class AuthMiddleware {

  static authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Split Bearer
    const token = authHeader.split(" ")[1];
    // Verify token
    const decoded = JwtUtils.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res.locals.id = decoded.id;
    res.locals.email = decoded.email;
    next();
  }
}