import { v4 as uuid } from "uuid";
import { User, userSchema } from "../domain/user";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export type CreateUserProps = Omit<User, "id">;

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
