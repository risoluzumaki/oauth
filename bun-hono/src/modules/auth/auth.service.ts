import { JwtUtils } from "../../utils/jwt.util";
import { UserRepositoryInterface } from "../user/user.repository";
import ApiError from "../../common/api.error";

export interface AuthServiceInterface {
  register(name: string, username: string, email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<string>;
  handleOauthCallback(provider: string, code: string): Promise<string>;
}

export class AuthService implements AuthServiceInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async register(
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(400, "Email already registered");
    }

    await this.userRepository.create({
      name,
      username,
      email,
      password,
      provider: "manual",
      provider_id: "",
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    if (user.provider !== "manual") {
      throw new ApiError(400, "Email registered with OAuth provider");
    }

    if (user.password !== password) {
      throw new ApiError(401, "Invalid password");
    }

    const token = JwtUtils.generateToken({ id: user.id, email: user.email });
    return token;
  }

  async handleOauthCallback(provider: string, code: string): Promise<string> {
      
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", process.env.GOOGLE_CLIENT_ID || "");
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET || "");
    params.append("redirect_uri", process.env.GOOGLE_CALLBACK_URL || "");
    params.append("grant_type", "authorization_code");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userInfoData = await userInfoResponse.json();

    let user = await this.userRepository.findByEmail(userInfoData.email);

    if (user && user.provider !== provider) {
      throw new ApiError(400, "Email already registered with different method");
    }

    if (!user) {
      const userName = userInfoData.email.split("@")[0];
      await this.userRepository.create({
        name: userInfoData.name,
        username: userName,
        email: userInfoData.email,
        password: "",
        provider,
        provider_id: userInfoData.sub,
      });

      user = await this.userRepository.findByEmail(userInfoData.email);
    }
    const token = JwtUtils.generateToken({ id: user!.id, email: user!.email });
    return token;
  }

}