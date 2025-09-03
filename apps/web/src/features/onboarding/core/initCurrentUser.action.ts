import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { AuthenticatedUser } from "./user";

export interface CurrentUserGateway {
  get(): Promise<AuthenticatedUser | undefined>;
  save(user: AuthenticatedUser): Promise<void>;
}

export const initCurrentUser = createAppAsyncThunk("user/initCurrentUser", async (_, { extra }) => {
  const currentUser = await extra.currentUserService.get();

  return currentUser;
});
