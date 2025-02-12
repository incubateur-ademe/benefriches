import { CreateSiteGateway, CreateSiteGatewayPayload } from "../../core/actions/siteSaved.actions";

export class HttpCreateSiteApi implements CreateSiteGateway {
  async save(newSite: CreateSiteGatewayPayload) {
    const response = await fetch(`/api/sites`, {
      method: "POST",
      body: JSON.stringify(newSite),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while creating site");
  }
}
