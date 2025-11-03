import ApiError from "../../common/api.error";
import { AuthServiceInterface } from "./auth.service";
import { Request, Response, NextFunction } from "express";

export class AuthController {
  
  constructor(private readonly authService: AuthServiceInterface) {}

  async registerUserManual(req: Request, res: Response, next: NextFunction) {
    const { name, username, email, password } = req.body;
    try {
      await this.authService.register(name, username, email, password);
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  async loginManual(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const token = await this.authService.login(email, password);
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  redirectOAuth(req: Request, res: Response , next: NextFunction) {
    const { provider } = req.params;

    if (provider !== "google") {
      return next(new ApiError(400, "Invalid provider"));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const scope = "email profile";
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    return res.redirect(redirectUrl);
  }
    
  async callbackOAuth(req: Request, res: Response, next: NextFunction) {
    const { provider } = req.params;
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return next(new ApiError(400, "Invalid code"));
    }

    try {
      const token = await this.authService.handleOauthCallback(provider, code);
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}
