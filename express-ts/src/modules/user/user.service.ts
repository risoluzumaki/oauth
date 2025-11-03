import { UserRepositoryInterface } from "./user.repository";
import { User } from "./user.repository";

export interface UserServiceInterface {
  profile(id: number): Promise<Partial<User>>;
}

export class UserService implements UserServiceInterface {

  constructor(private userRepository: UserRepositoryInterface) {}

  async profile(id: number) : Promise<Partial<User>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const dataUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    }

    return dataUser;
  }
}