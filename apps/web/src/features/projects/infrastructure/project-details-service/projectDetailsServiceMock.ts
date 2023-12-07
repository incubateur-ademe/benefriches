import {
  ProjectDetailsResult,
  ProjectsDetailsGateway,
} from "../../application/projectImpactsComparison.actions";

export class ProjectDetailsServiceMock implements ProjectsDetailsGateway {
  constructor(
    private result: ProjectDetailsResult,
    private shouldFail: boolean = false,
  ) {}

  async getProjectById() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
