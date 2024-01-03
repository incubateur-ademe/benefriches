import { GetSiteGateway } from "../../application/createProject.actions";
import { ProjectSite } from "../../domain/project.types";

import { SITES_LIST_STORAGE_KEY } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { delay } from "@/shared/services/delay/delay";

export class LocalStorageGetSiteApi implements GetSiteGateway {
  async getById(siteId: string): Promise<ProjectSite | undefined> {
    await delay(300);
    const fromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);
    const siteList = fromLocalStorage ? (JSON.parse(fromLocalStorage) as ProjectSite[]) : [];

    if (!siteList) return undefined;

    return siteList.find((site) => site.id === siteId);
  }
}
