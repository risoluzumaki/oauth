import { Router } from "express";
import { UserController } from "./user.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";

export class UserRoute {
  public router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.router.use(AuthMiddleware.authenticate);
    this.routes();
  }

  private routes() {
    this.router.get("/profile", (req, res, next) =>
      this.userController.getProfile(req, res, next)
    );
  }
}

