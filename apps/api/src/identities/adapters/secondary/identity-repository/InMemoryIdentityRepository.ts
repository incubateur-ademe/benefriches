import { Identity } from "src/identities/domain/model/identity";
import { IdentityRepository } from "src/identities/domain/usecases/createIdentity.usecase";

export class InMemoryIdentityRepository implements IdentityRepository {
  private identities: Identity[] = [];

  async save(identity: Identity) {
    this.identities.push(identity);
    await Promise.resolve();
  }

  _getIdentities() {
    return this.identities;
  }

  _setIdentities(identities: Identity[]) {
    this.identities = identities;
  }
}
