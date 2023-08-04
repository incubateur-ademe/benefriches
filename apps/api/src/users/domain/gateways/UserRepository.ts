import { User } from "../models/user";

export interface UserRepository {
  existsWithEmail(email: string): Promise<boolean>;
  save(user: User): Promise<void>;
}
