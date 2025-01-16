import { CurrentUserGateway } from "../../core/initCurrentUser.action";
import { User } from "../../core/user";

export class InMemoryCurrentUserService implements CurrentUserGateway {
  constructor(private readonly shouldFail: boolean = false) {}

  async get() {
    if (this.shouldFail) throw new Error("Intended error");

    return await Promise.resolve({
      id: "72cf2f39-8859-461c-b060-beb9aaab6fad",
      email: "email@test.fr",
      structureType: "company",
      structureActivity: "urban_planner",
      structureName: "User company",
      personalDataStorageConsented: true,
      personalDataAnalyticsUseConsented: true,
      personalDataCommunicationUseConsented: true,
    } as User);
  }

  save(): Promise<void> {
    return Promise.resolve();
  }
}
