
import { Context } from "hono";
import { UserServiceInterface } from "./user.service";

export class UserController {
  constructor(private readonly userService: UserServiceInterface) {}

  async getProfile(c: Context) {
    const { id } = c.get('jwtPayload');
    if (!id) {
      throw new Error("Unauthorized");
    }
    try {
      const user = await this.userService.profile(parseInt(id));
      return c.json(user);
    } catch (error) {
      throw error;
    }
  }
}
