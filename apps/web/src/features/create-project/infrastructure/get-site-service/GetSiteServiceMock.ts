import { GetSiteGateway } from "../../application/createProject.actions";
import { ProjectSite } from "../../domain/project.types";

export class GetSiteServiceMock implements GetSiteGateway {
  constructor(private result: ProjectSite) {}

  async getById(): Promise<ProjectSite | undefined> {
    return Promise.resolve(this.result);
  }
}
