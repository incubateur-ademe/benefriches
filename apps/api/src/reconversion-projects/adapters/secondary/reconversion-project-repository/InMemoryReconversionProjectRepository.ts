import { ReconversionProject } from "src/reconversion-projects/domain/model/reconversionProject";
import { ReconversionProjectRepository } from "src/reconversion-projects/domain/usecases/createReconversionProject.usecase";

export class InMemoryReconversionProjectRepository implements ReconversionProjectRepository {
  private reconversionProjects: ReconversionProject[] = [];

  async save(site: ReconversionProject) {
    this.reconversionProjects.push(site);
    await Promise.resolve();
  }

  existsWithId(reconversionProjectId: string): Promise<boolean> {
    const foundReconversionProject = this.reconversionProjects.find(
      ({ id }) => id === reconversionProjectId,
    );
    return Promise.resolve(!!foundReconversionProject);
  }

  getById(reconversionProjectId: string): Promise<ReconversionProject | undefined> {
    return Promise.resolve(
      this.reconversionProjects.find(({ id }) => id === reconversionProjectId),
    );
  }

  _getReconversionProjects() {
    return this.reconversionProjects;
  }

  _setReconversionProjects(reconversionProjects: ReconversionProject[]) {
    this.reconversionProjects = reconversionProjects;
  }
}
