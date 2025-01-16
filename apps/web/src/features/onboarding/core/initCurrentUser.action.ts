import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { User } from "./user";

export interface CurrentUserGateway {
  get(): Promise<User | undefined>;
  save(user: User): Promise<void>;
}

export const initCurrentUser = createAppAsyncThunk("user/initCurrentUser", async (_, { extra }) => {
  const currentUser = await extra.currentUserService.get();

  return currentUser;
});
