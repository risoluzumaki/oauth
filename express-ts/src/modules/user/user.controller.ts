import { Request, Response, NextFunction } from "express";
import { UserServiceInterface } from "./user.service";

export class UserController {
  constructor(private readonly userService: UserServiceInterface) {}

  async getProfile(req: Request, res: Response, next: NextFunction){
    const id = res.locals.id;
    if (!id) {
      return next(new Error("Unauthorized"));
    }
    try {
      const user = await this.userService.profile(parseInt(id));
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
}