
import { Context } from "hono";
import { AuthServiceInterface } from "./auth.service";
import ApiError from "../../common/api.error";

export class AuthController {
  constructor(private readonly authService: AuthServiceInterface) {}

  async registerUserManual(c: Context) {
    const { name, username, email, password } = await c.req.json();
    try {
      await this.authService.register(name, username, email, password);
      return c.json({ message: "User registered successfully" }, 201);
    } catch (error) {
      throw error;
    }
  }

  async loginManual(c: Context) {
    const { email, password } = await c.req.json();
    try {
      const token = await this.authService.login(email, password);
      return c.json({ token });
    } catch (error) {
      throw error;
    }
  }

  redirectOAuth(c: Context) {
    const { provider } = c.req.param();

    if (provider !== "google") {
      throw new ApiError(400, "Invalid provider");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const scope = "email profile";
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    return c.redirect(redirectUrl);
  }

  async callbackOAuth(c: Context) {
    const { provider } = c.req.param();
    const { code } = c.req.query();

    if (!code || typeof code !== "string") {
      throw new ApiError(400, "Invalid code");
    }

    try {
      const token = await this.authService.handleOauthCallback(provider, code);
      return c.json({ token });
    } catch (error) {
      throw error;
    }
  }
}
