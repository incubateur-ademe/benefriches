import type { CurrentUserGateway } from "../../core/initCurrentUser.action";
import type { AuthenticatedUser } from "../../core/user";

const CURRENT_USER_STORAGE_KEY = "benefriches/current-user/v0";

export class LocalStorageCurrentUserService implements CurrentUserGateway {
  get(): Promise<AuthenticatedUser | undefined> {
    const fromLocalStorage = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (!fromLocalStorage) throw new Error("No user in local storage");

    const user = JSON.parse(fromLocalStorage) as Omit<AuthenticatedUser, "isAdmin"> & {
      isAdmin?: boolean;
    };
    return Promise.resolve({ ...user, isAdmin: user.isAdmin ?? false });
  }

  save(user: AuthenticatedUser): Promise<void> {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    return Promise.resolve();
  }
}
