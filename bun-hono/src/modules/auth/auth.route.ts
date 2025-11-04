
import { Hono } from "hono";
import { AuthController } from "./auth.controller";

export const authRoute = (app: Hono, authController: AuthController) => {
  const auth = new Hono();

  auth.post("/register", (c) => authController.registerUserManual(c));
  auth.post("/login", (c) => authController.loginManual(c));
  auth.get("/:provider", (c) => authController.redirectOAuth(c));
  auth.get("/:provider/callback", (c) => authController.callbackOAuth(c));

  app.route('/auth', auth)
};
