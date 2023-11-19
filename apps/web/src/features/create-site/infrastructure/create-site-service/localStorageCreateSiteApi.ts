import {
  CreateSiteGateway,
  CreateSiteGatewayPayload,
} from "../../application/createSite.actions";

const SITES_LIST_STORAGE_KEY = "benefriches/sites-list";

const delay = (delayInMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayInMs));

export class LocalStorageCreateSiteApi implements CreateSiteGateway {
  async save(newSite: CreateSiteGatewayPayload) {
    await delay(500);

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
