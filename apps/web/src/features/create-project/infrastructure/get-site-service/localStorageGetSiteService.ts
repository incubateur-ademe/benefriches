import { GetSiteGateway } from "../../application/createProject.actions";
import { ProjectSite } from "../../domain/project.types";

const SITES_LIST_STORAGE_KEY = "benefriches/sites-list";

const delay = (delayInMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayInMs));

export class LocalStorageGetSiteApi implements GetSiteGateway {
  async getById(siteId: string): Promise<ProjectSite | undefined> {
    await delay(500);
    const fromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);
    const siteList = fromLocalStorage
      ? (JSON.parse(fromLocalStorage) as ProjectSite[])
      : [];

    if (!siteList) return undefined;

    return siteList.find((site) => site.id === siteId);
  }
}
