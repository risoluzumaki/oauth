import { Hono } from "hono";
import { UserController } from "./user.controller";

export const userRoute = (app: Hono, userController: UserController) => {
    const user = new Hono()
    user.get("/profile", (c) => userController.getProfile(c));
    app.route('/users', user)
};
