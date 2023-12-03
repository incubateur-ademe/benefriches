import {
  CreateSiteGateway,
  CreateSiteGatewayPayload,
} from "../../application/createSite.actions";

import { delay } from "@/shared/services/delay/delay";

export const SITES_LIST_STORAGE_KEY = "benefriches/sites-list";

export class LocalStorageCreateSiteApi implements CreateSiteGateway {
  async save(newSite: CreateSiteGatewayPayload) {
    await delay(300);

    const fromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);
    const siteList = fromLocalStorage
      ? (JSON.parse(fromLocalStorage) as CreateSiteGatewayPayload[])
      : [];
    localStorage.setItem(
      SITES_LIST_STORAGE_KEY,
      JSON.stringify([...siteList, newSite]),
    );
  }
}
