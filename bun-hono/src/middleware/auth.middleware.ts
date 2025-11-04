
import { Context, Next } from "hono";
import { JwtUtils } from "../utils/jwt.util";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization");
  if (!authHeader) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  // Split Bearer
  const token = authHeader.split(" ")[1];
  // Verify token
  try {
    const decoded = JwtUtils.verifyToken(token);
    c.set('jwtPayload', decoded)
    await next();
  } catch (error) {
    return c.json({ message: "Unauthorized" }, 401);
  }
};
