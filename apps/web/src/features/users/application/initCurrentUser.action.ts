import { v4 as uuid } from "uuid";
import { User } from "../domain/user";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface UserGateway {
  getCurrentUser(): Promise<User | undefined>;
  saveCurrentUser(user: User): Promise<void>;
}

export const initCurrentUserAction = createAppAsyncThunk(
  "user/initCurrentUser",
  async (_, { extra }) => {
    const currentUser = await extra.userService.getCurrentUser();

    if (currentUser) return currentUser;

    const anonymousUser = {
      id: uuid(),
      firstName: "Utilisateur/rice",
      lastName: "Anonyme",
    };
    await extra.userService.saveCurrentUser(anonymousUser);

    return anonymousUser;
  },
);
