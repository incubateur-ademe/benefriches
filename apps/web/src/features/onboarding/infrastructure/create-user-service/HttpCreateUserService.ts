import { CreateUserGateway } from "../../core/createUser.action";
import { User } from "../../core/user";

export class HttpCreateUserService implements CreateUserGateway {
  async save(user: User) {
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(user),
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
