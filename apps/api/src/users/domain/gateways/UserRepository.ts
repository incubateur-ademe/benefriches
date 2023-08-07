import { User } from "../models/user";

export interface UserRepository {
  existsWithEmail(email: string): Promise<boolean>;
  getWithEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
