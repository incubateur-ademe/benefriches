import { registerUserRequestDtoSchema } from "shared";

import { CreateUserGateway } from "../../core/createUser.action";
import type { User } from "../../core/user";

export class HttpCreateUserService implements CreateUserGateway {
  async save(user: User) {
    const parsedUser = registerUserRequestDtoSchema.safeParse(user);

    if (!parsedUser.success) {
      throw new Error("HttpSiteService: Invalid response format", parsedUser.error);
    }

    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(parsedUser.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const { error } = (await response.json()) as Error & { error?: string };
      throw new Error(error ?? "UNKNOWN_ERROR");
    }
  }
}
