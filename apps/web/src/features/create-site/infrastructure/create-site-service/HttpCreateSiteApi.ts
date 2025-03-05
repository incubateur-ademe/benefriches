import { API_ROUTES } from "shared";

import {
  CreateSiteGateway,
  CustomSitePayload,
  ExpressSitePayload,
} from "../../core/actions/siteSaved.actions";

export class HttpCreateSiteApi implements CreateSiteGateway {
  async saveCustom(newSite: CustomSitePayload) {
    const response = await fetch(`/api/${API_ROUTES.SITES.CREATE_CUSTOM_SITE.path}`, {
      method: "POST",
      body: JSON.stringify(newSite),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while creating custom site");
  }

  async saveExpress(newSite: ExpressSitePayload): Promise<void> {
    const response = await fetch(`/api/${API_ROUTES.SITES.CREATE_EXPRESS_SITE.path}`, {
      method: "POST",
      body: JSON.stringify(newSite),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while creating express site");
  }
}
