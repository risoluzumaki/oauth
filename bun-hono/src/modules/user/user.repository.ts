export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  provider: string;
  provider_id: string;
  password: string;
};

export interface UserRepositoryInterface {
  create(user: Omit<User, "id">): Promise<void>;
  findById(id: number): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByProvider(provider: string, provider_id: string): Promise<User | undefined>;
}

export class UserRepository implements UserRepositoryInterface {
  private users: User[] = [];

  async create(user: Omit<User, "id">): Promise<void> {
    const newUser = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    console.log(this.users);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findByProvider(provider: string, provider_id: string): Promise<User | undefined> {
    return this.users.find(
      (user) => user.provider === provider && user.provider_id === provider_id
    );
  }
}

export const userRepository = new UserRepository();