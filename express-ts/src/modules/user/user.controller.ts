import { Request, Response, NextFunction } from "express";
import { UserServiceInterface } from "./user.service";
import ApiError from "../../common/api.error";

export class UserController {
  constructor(private readonly userService: UserServiceInterface) {}

  async getProfile(req: Request, res: Response, next: NextFunction){
    const id = res.locals.id as number;
    if (!id) {
      return next(new ApiError(401, "Unauthorized"));
    }
    try {
      const user = await this.userService.profile(id);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
}