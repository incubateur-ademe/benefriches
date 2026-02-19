import { CreateExpressSiteDto } from "shared";

import { CreateSiteGateway, CustomSitePayload } from "../../core/steps/final/final.actions";

export class HttpCreateSiteApi implements CreateSiteGateway {
  async saveCustom(newSite: CustomSitePayload) {
    const response = await fetch("/api/sites/create-custom", {
      method: "POST",
      body: JSON.stringify(newSite),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while creating custom site");
  }

  async saveExpress(newSite: CreateExpressSiteDto): Promise<void> {
    const response = await fetch("/api/sites/create-express", {
      method: "POST",
      body: JSON.stringify(newSite),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while creating express site");
  }
}
