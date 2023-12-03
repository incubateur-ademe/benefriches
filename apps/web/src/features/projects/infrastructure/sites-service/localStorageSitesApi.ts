import { SitesGateway } from "../../application/projectsList.actions";
import { SitesList } from "../../domain/projects.types";

import { ProjectSite } from "@/features/create-project/domain/project.types";
import { SITES_LIST_STORAGE_KEY } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { delay } from "@/shared/services/delay/delay";

export class LocalStorageSitesApi implements SitesGateway {
  async getSitesList(): Promise<SitesList> {
    await delay(300);

    const sitesFromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);

    const sitesList = sitesFromLocalStorage
      ? (JSON.parse(sitesFromLocalStorage) as ProjectSite[])
      : [];

    return sitesList.map((site) => ({
      id: site.id,
      name: site.name,
    }));
  }
}
