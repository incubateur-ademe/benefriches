import { CurrentUserGateway } from "../../core/initCurrentUser.action";
import { User } from "../../core/user";

const CURRENT_USER_STORAGE_KEY = "benefriches/current-user/v0";

export class LocalStorageUserService implements CurrentUserGateway {
  get(): Promise<User | undefined> {
    const fromLocalStorage = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    const user = fromLocalStorage ? (JSON.parse(fromLocalStorage) as User) : undefined;
    return Promise.resolve(user);
  }

  save(user: User): Promise<void> {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    return Promise.resolve();
  }
}
