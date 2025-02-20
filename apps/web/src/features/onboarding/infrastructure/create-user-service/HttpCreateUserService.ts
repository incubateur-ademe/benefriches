import { CreateUserGateway } from "../../core/createUser.action";
import { User } from "../../core/user";

export class HttpCreateUserService implements CreateUserGateway {
  async save(user: User) {
    const response = await fetch(`/api/users`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while creating user");
  }
}
