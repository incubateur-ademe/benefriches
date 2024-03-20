import { CreateIdentityPayload, IdentityGateway } from "../../application/createIdentity.action";

export class InMemoryCreateIdentityService implements IdentityGateway {
  _identities: CreateIdentityPayload[] = [];

  constructor(private readonly shouldFail: boolean = false) {}

  async save(newIdentity: CreateIdentityPayload) {
    if (this.shouldFail) throw new Error("Intended error");

    await Promise.resolve(this._identities.push(newIdentity));
  }
}
