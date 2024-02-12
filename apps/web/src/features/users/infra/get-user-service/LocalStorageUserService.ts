import { UserGateway } from "../../application/initCurrentUser.action";
import { User } from "../../domain/user";

const CURRENT_USER_STORAGE_KEY = "benefriches/current-user";

export class LocalStorageUserService implements UserGateway {
  getCurrentUser(): Promise<User | undefined> {
    const fromLocalStorage = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    const user = fromLocalStorage ? (JSON.parse(fromLocalStorage) as User) : undefined;
    return Promise.resolve(user);
  }

  saveCurrentUser(user: User): Promise<void> {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    return Promise.resolve();
  }
}
