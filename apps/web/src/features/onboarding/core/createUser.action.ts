import { v4 as uuid } from "uuid";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { User, userSchema } from "./user";

type CreateUserProps = Omit<User, "id">;

export interface CreateUserGateway {
  save(user: User): Promise<void>;
}

export const createUser = createAppAsyncThunk<User, CreateUserProps>(
  "user/createUser",
  async (createUserProps, { extra }) => {
    const user = userSchema.parse({ ...createUserProps, id: uuid() });

    await extra.createUserService.save(user);
    await extra.currentUserService.save(user);

    return user;
  },
);
