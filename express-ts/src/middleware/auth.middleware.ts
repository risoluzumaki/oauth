import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "../utils/jwt.util";

class AuthMiddleware {

  static authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Split Bearer
    const token = authHeader.split(" ")[1];
    // Verify token
    const decoded = JwtUtils.verifyToken(token);
    res.locals.id = decoded?.id;
    res.locals.email = decoded?.email;
    next();
  }
}