import { CreateIdentityPayload, IdentityGateway } from "../../application/createIdentity.action";

export class HttpCreateIdentityApi implements IdentityGateway {
  async save(identity: CreateIdentityPayload) {
    const response = await fetch(`/api/identities`, {
      method: "POST",
      body: JSON.stringify(identity),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while creating identity");
  }
}
