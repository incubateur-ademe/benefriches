import { User } from "../model/user";

export interface UserRepository {
  save(user: User): Promise<void>;
}
