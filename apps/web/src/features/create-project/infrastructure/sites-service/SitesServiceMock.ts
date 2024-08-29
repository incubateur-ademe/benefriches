import { GetSitesByIdGateway } from "../../application/createProject.actions";
import { ProjectSite } from "../../domain/project.types";

export class SitesServiceMock implements GetSitesByIdGateway {
  constructor(private result?: ProjectSite) {}

  async getById(): Promise<ProjectSite | undefined> {
    return Promise.resolve(this.result);
  }
}
