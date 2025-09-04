import { v4 as uuid } from "uuid";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { BENEFRICHES_ENV } from "@/shared/views/envVars";

import { initCurrentUser } from "./initCurrentUser.action";
import { User, userSchema } from "./user";

type CreateUserProps = Omit<User, "id">;

export interface CreateUserGateway {
  save(user: User): Promise<void>;
}

export const createUser = createAppAsyncThunk<User, CreateUserProps>(
  "user/registerUser",
  async (createUserProps, { extra, dispatch }) => {
    const user = userSchema.parse({ ...createUserProps, id: uuid() });

    await extra.createUserService.save(user);

    // todo: remove when real auth released production
    if (!BENEFRICHES_ENV.authEnabled) await extra.currentUserService.save(user);

    await dispatch(initCurrentUser());
    return user;
  },
);
