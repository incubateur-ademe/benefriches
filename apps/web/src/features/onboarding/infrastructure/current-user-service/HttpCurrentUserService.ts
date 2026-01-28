import { getCurrentUserResponseDtoSchema } from "shared";

import { CurrentUserGateway } from "../../core/initCurrentUser.action";
import { AuthenticatedUser } from "../../core/user";

export class HttpCurrentUserService implements CurrentUserGateway {
  async get(): Promise<AuthenticatedUser | undefined> {
    const response = await fetch("/api/auth/me");

    if (!response.ok) throw new Error(`Error while fetching me`);

    const jsonResponse: unknown = await response.json();
    const result = getCurrentUserResponseDtoSchema.safeParse(jsonResponse);

    if (!result.success) {
      throw new Error("HttpCurrentUserService: Invalid response format");
    }

    return {
      id: result.data.id,
      email: result.data.email,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      structureType: result.data.structureType as AuthenticatedUser["structureType"],
      structureActivity: result.data.structureActivity as AuthenticatedUser["structureActivity"],
      structureName: result.data.structureName,
    };
  }

  async save(): Promise<void> {
    return Promise.resolve();
  }
}
