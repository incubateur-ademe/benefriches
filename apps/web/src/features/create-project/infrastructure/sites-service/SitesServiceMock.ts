import { GetSitesByIdGateway } from "../../core/createProject.actions";
import { ProjectSite } from "../../core/project.types";

export class SitesServiceMock implements GetSitesByIdGateway {
  constructor(private result?: ProjectSite) {}

  async getById(): Promise<ProjectSite | undefined> {
    return Promise.resolve(this.result);
  }
}
