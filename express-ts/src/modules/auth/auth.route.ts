import { Router } from "express";
import { AuthController } from "./auth.controller";

export class AuthRoute {
  public router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post("/register", (req, res, next) => 
      this.authController.registerUserManual(req, res, next)
    );

    this.router.post("/login", (req, res, next) =>
      this.authController.loginManual(req, res, next)
    );

    this.router.get("/:provider", (req, res, next) =>
      this.authController.redirectOAuth(req, res, next)
    );
    this.router.get("/:provider/callback", (req, res, next) =>
      this.authController.callbackOAuth(req, res, next)
    );
  }
}
