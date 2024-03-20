import { User } from "../domain/user";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface CurrentUserGateway {
  get(): Promise<User | undefined>;
  save(user: User): Promise<void>;
}

export const initCurrentUser = createAppAsyncThunk("user/initCurrentUser", async (_, { extra }) => {
  const currentUser = await extra.currentUserService.get();

  return currentUser;
});
