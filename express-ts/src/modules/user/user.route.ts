import { Router } from "express";
import { UserController } from "./user.controller";

export class UserRoute {
  public router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/profile", (req, res, next) =>
      this.userController.getProfile(req, res, next)
    );
  }
}

