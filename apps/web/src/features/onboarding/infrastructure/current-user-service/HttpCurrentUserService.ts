import { CurrentUserGateway } from "../../core/initCurrentUser.action";
import { AuthenticatedUser } from "../../core/user";

export class HttpCurrentUserService implements CurrentUserGateway {
  async get(): Promise<AuthenticatedUser | undefined> {
    const response = await fetch("/api/auth/me");

    if (!response.ok) throw new Error(`Error while fetching me`);

    const jsonResponse = (await response.json()) as AuthenticatedUser;
    return jsonResponse;
  }

  async save(): Promise<void> {
    return Promise.resolve();
  }
}
