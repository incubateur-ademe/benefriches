import { v4 as uuid } from "uuid";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

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

    await dispatch(initCurrentUser());
    return user;
  },
);
